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
  const outerRef = useRef(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(-1);
  const [scrollTracking, setScrollTracking] = useState(true);
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
      onSortEnd(sortEvent, nativeEvent, outerRef.current);
    }
  }, [onSortEnd]);

  useEffect(() => {
    if (selectedPageIndex !== -1) {
      const instance = outerRef.current.getWrappedInstance();
      const list = instance.sortablePageListRef.current;
      list.scrollToItem(selectedPageIndex);
    }
  }, [selectedPageIndex]);

  useEffect(() => { // for page thumbnails actions
    if (!scrollTracking) {
      scrollToTarget(`pageActions-id-${selectedPageIndex}`, 0, {});
      setScrollTracking(true);
    }
  }, [pageCount]);

  usePageVisibility(index => {
    if (scrollTracking && index !== selectedPageIndex && !Number.isNaN(index)) {
      setSelectedPageIndex(index);
    } else if (!scrollTracking && index === selectedPageIndex) {
      setScrollTracking(true);
    }
  }, scrollTracking, pageCount, selectedPageIndex);

  const onPageClick = useCallback(e => {
    const order = e.target.getAttribute('data-order');
    setScrollTracking(false);
    setSelectedPageIndex(parseInt(order, 10));
    if (!e.target.classList.contains('controllerItem')) { // for page thumbnails actions
      scrollToTarget(`pageActions-id-${order}`);
    }
  }, []);

  const handlePageAdd = useCallback(index => {
    setScrollTracking(false);
    setSelectedPageIndex(index);
    onPageAdd(index);
  }, [onPageAdd]);

  return (
    <>
      <ResponsiveContainer>
        <ResponsiveContent>
          {(containerWidth, containerHeight) => (
            <Component
              ref={outerRef}
              distance={50}
              height={containerHeight}
              helperClass="pageThumbnailHelper"
              lockAxis="y"
              onPageClick={onPageClick}
              onSortEnd={_onSortEnd}
              pageContainerStyle={pageContainerStyles}
              pageCount={pageCount}
              selectedPageIndex={selectedPageIndex}
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
