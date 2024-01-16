import {
  memo, useCallback, useRef, useState, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from 'recharts';
import ResponsiveContent from '../../ResponsiveContent';
import PageAdder from '../../Builder/PageAdder';
import { getScaleForPageThumbnail, scrollToTarget } from '../../../utils/functions';
import { usePageVisibility } from '../../../utils/hooks';

const ListWrapper = ({
  component: Component,
  onPageAdd,
  onSortEnd,
  pageCount,
  reportSettings,
  ...otherProps
}) => {
  const listRef = useRef(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(-1);
  const {
    reportBackgroundColor,
    reportLayoutHeight = 794,
    reportLayoutWidth = 1123,
  } = reportSettings;
  const width = parseInt(reportLayoutWidth, 10);
  const height = parseInt(reportLayoutHeight, 10);
  const { left, scale, top } = getScaleForPageThumbnail(width, height);

  const pageContainerStyles = useMemo(() => ({
    backgroundColor: reportBackgroundColor || '#fff',
    height: height,
    left,
    top,
    transform: `scale(${scale})`,
    transformOrigin: '0 0',
    width: width,
  }), [reportSettings]);

  const _onSortEnd = useCallback((sortEvent, nativeEvent) => {
    if (onSortEnd) {
      onSortEnd(sortEvent, nativeEvent, listRef.current);
    }
  }, [onSortEnd]);

  const refSetter = useCallback(outerRef => {
    if (outerRef) {
      const instance = outerRef.getWrappedInstance();
      if (instance) {
        listRef.current = instance.sortablePageListRef.current;
      }
    }
  }, []);

  usePageVisibility(index => {
    if (index && !Number.isNaN(index)) {
      listRef.current?.scrollToItem(index, 'center');

      const prevSelectedThumbnail = document.querySelector('.thumbnailWrapper.isSelected');
      if (prevSelectedThumbnail) {
        prevSelectedThumbnail.classList.remove('isSelected');
      }

      const nextSelectedThumbnail = document
        .querySelector(`.thumbnailWrapper[data-order="${index}"]`);
      if (nextSelectedThumbnail) {
        nextSelectedThumbnail.classList.add('isSelected');
      }
    }
  }, pageCount, selectedPageIndex);

  // TODO: could be better than now. scrollend listener is a choice for some cases
  const resetSelectedPageIndex = useCallback(() => {
    setTimeout(() => {
      setSelectedPageIndex(-1);
    }, 1000);
  }, []);

  const onPageClick = useCallback(e => {
    const order = e.target.getAttribute('data-order');
    setSelectedPageIndex(parseInt(order, 10));
    if (!e.target.classList.contains('controllerItem')) { // for page thumbnails actions
      scrollToTarget(`pageActions-id-${order}`);
    }
    resetSelectedPageIndex();
  }, []);

  const handlePageAdd = useCallback(index => {
    setSelectedPageIndex(index);
    onPageAdd(index);
  }, [onPageAdd]);

  useEffect(() => { // after new page added
    scrollToTarget(`pageActions-id-${selectedPageIndex}`, 0, {});
    resetSelectedPageIndex();
  }, [pageCount]);

  return (
    <>
      <ResponsiveContainer>
        <ResponsiveContent>
          {(containerWidth, containerHeight) => (
            <Component
              ref={refSetter}
              distance={50}
              height={containerHeight}
              helperClass="pageThumbnailHelper"
              lockAxis="y"
              onPageAdd={handlePageAdd}
              onPageClick={onPageClick}
              onSortEnd={_onSortEnd}
              pageContainerStyle={pageContainerStyles}
              pageCount={pageCount}
              width={containerWidth}
              {...otherProps}
            />
          )}
        </ResponsiveContent>
      </ResponsiveContainer>
      <div className="jfReport-pane-footer">
        <PageAdder
          additionalClass="forOptions"
          onPageAdd={handlePageAdd}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};

ListWrapper.propTypes = {
  component: PropTypes.any,
  onPageAdd: PropTypes.func,
  onSortEnd: PropTypes.func,
  pageCount: PropTypes.number,
  reportSettings: PropTypes.shape({
    reportBackgroundColor: PropTypes.string,
    reportLayoutHeight: PropTypes.string,
    reportLayoutWidth: PropTypes.string,
  }),
};

ListWrapper.defaultProps = {
  component: null,
  onPageAdd: () => {},
  onSortEnd: () => {},
  pageCount: 0,
  reportSettings: {},
};

export default memo(ListWrapper);
