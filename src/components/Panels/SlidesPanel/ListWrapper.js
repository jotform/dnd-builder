import {
  memo, useCallback, useRef, useState, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import PageAdder from '../../Builder/PageAdder';
import { getScaleForPageThumbnail, scrollToTarget } from '../../../utils/functions';
import { usePageVisibility } from '../../../utils/hooks';
import { usePropStore } from '../../../contexts/PropContext';

const ListWrapper = ({
  component: Component = null,
  onSortEnd = () => {},
  pageGetter = () => {},
}) => {
  const pages = usePropStore(state => state.pages);
  const pageCount = useMemo(() => pages.length, [pages]);
  const onPageAdd = usePropStore(state => state.onPageAdd);
  const reportSettings = usePropStore(state => state.settings);

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

  const _onSortEnd = useCallback(({ newIndex, oldIndex }) => {
    if (onSortEnd) {
      onSortEnd({ newIndex, oldIndex }, null, listRef.current);
    }
  }, [onSortEnd]);

  const refSetter = useCallback(outerRef => {
    if (outerRef) {
      listRef.current = outerRef;
    }
  }, []);

  usePageVisibility(index => {
    if (index && !Number.isNaN(index)) {
      if (listRef.current?.scrollToIndex) {
        listRef.current.scrollToIndex(index, 'center');
      }

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
      <div
        style={{
          height: '100%', margin: '25px 10px', position: 'relative', width: '100%',
        }}
      >
        <Component
          ref={refSetter}
          height="100%"
          onPageAdd={handlePageAdd}
          onPageClick={onPageClick}
          onSortEnd={_onSortEnd}
          pageContainerStyle={pageContainerStyles}
          pageCount={pageCount}
          pageGetter={pageGetter}
          width="100%"
        />
      </div>
      <div className="jfReport-pane-footer">
        <PageAdder additionalClass="forOptions" />
      </div>
    </>
  );
};

ListWrapper.propTypes = {
  component: PropTypes.any,
  onSortEnd: PropTypes.func,
  pageGetter: PropTypes.func,
};

export default memo(ListWrapper);
