/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable complexity */
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';
import * as classNames from '../../constants/classNames';
import ContextMenu from './ContextMenu';
import PageActions from './PageActions';
import PageAdder from './PageAdder';
import ZoomControls from './ZoomControls';
import SelectionBox from './SelectionBox';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';
import Page from './Page';
import {
  calculateGuidePositions,
  findItemById,
  findItemsOnPage,
  isSlidesListType,
} from '../../utils/functions';
import DraggableLayer from './DraggableLayer';
import useKeyboardActions from '../../utils/useKeyboardActions';
import useMarqueeSelection from '../../utils/useMarqueeSelection';
import SlidesNavigatorToggle from './SlidesNavigatorToggle';
import { useScenePageScroller } from '../../utils/hooks';
import { getPageId } from '../../utils/getPageId';

const OVERSCAN_PAGE_COUNT = 2;

const Scene = () => {
  const pages = usePropStore(state => state.pages);
  const settings = usePropStore(state => state.settings);
  const contextMenuProps = useBuilderStore(state => state.contextMenuProps);
  const setContextMenuProps = useBuilderStore(state => state.setContextMenuProps);
  const setGuides = useBuilderStore(state => state.setGuides);
  const zoom = useBuilderStore(state => state.zoom);
  const lastScrollPosition = useBuilderStore(state => state.lastScrollPosition);
  const slidesListType = useBuilderStore(state => state.slidesListType);
  const setOverPage = useBuilderStore(state => state.setOverPage);
  const setOutPage = useBuilderStore(state => state.setOutPage);
  const renderedPageRange = useBuilderStore(state => state.renderedPageRange);
  const setRenderedPageRange = useBuilderStore(state => state.setRenderedPageRange);

  const [viewPort, setViewPort] = useState(null);
  const [isListMeasured, setIsListMeasured] = useState(false);
  const canvasRef = useRef(null);

  const refs = useRef({});
  const getPageRef = useCallback(pageID => {
    if (!refs.current[pageID]) {
      refs.current[pageID] = createRef(null);
    }
    return refs.current[pageID];
  }, []);

  // Custom hooks
  useKeyboardActions();
  const { selectionBox, selectionPageId } = useMarqueeSelection(canvasRef);
  const virtuosoRef = useScenePageScroller(pages, refs);

  // Calculate guides for snap functionality
  useEffect(() => {
    setGuides(pages.reduce((acc, page) => {
      const _pageGuides = {};
      const pageRef = refs.current[page.id];
      if (pageRef && pageRef.current) {
        const {
          height, left, top, width,
        } = pageRef.current.getBoundingClientRect();
        const boundingBox = {
          height, left, top, width,
        };
        _pageGuides.boundingBox = {
          x: calculateGuidePositions(boundingBox, 'x').map(value => value - boundingBox.left),
          y: calculateGuidePositions(boundingBox, 'y').map(value => value - boundingBox.top),
        };
        page.items.forEach(item => {
          _pageGuides[item.id] = {
            x: calculateGuidePositions(item, 'x', zoom),
            y: calculateGuidePositions(item, 'y', zoom),
          };
        });
      }
      acc[page.id] = _pageGuides;
      return acc;
    }, {}));
  }, [pages, zoom, setGuides, renderedPageRange]);

  const handleTotalListHeightChange = useCallback(listHeight => {
    if (listHeight > 0) {
      setIsListMeasured(true);
    }
  }, []);

  // Restore scroll position after mode change
  useEffect(() => {
    if (viewPort && isListMeasured) {
      viewPort.scrollTop = lastScrollPosition;
    }
  }, [viewPort, isListMeasured, lastScrollPosition]);

  const { reportLayoutHeight = 794, reportLayoutWidth = 1123 } = settings;

  // TODO: Some strange shit is going on here on first render
  let width = parseInt(reportLayoutWidth, 10);
  let height = parseInt(reportLayoutHeight, 10);
  width = Number.isNaN(width) ? 1 : width;
  height = Number.isNaN(height) ? 1 : height;
  const zoomToUse = Number.isNaN(zoom) ? 1 : zoom;
  const zoomedHeight = parseFloat((height * zoomToUse).toFixed(1));
  const zoomedWidth = parseFloat((width * zoomToUse).toFixed(1));

  const pageStyle = useMemo(() => ({
    height: zoomedHeight,
    position: 'relative',
    width: zoomedWidth,
  }), [zoomedHeight, zoomedWidth]);

  const pageContainerStyle = useMemo(() => ({
    height,
    transform: `scale(${zoomToUse})`,
    transformOrigin: '0 0',
    width,
  }), [height, width, zoomToUse]);

  const listStyle = useMemo(() => ({ width: zoomedWidth }), [zoomedWidth]);

  const pageOverHandler = useCallback(pageId => {
    setOverPage(pageId);
  }, [setOverPage]);

  const pageOutHandler = useCallback(() => {
    setOutPage(null);
  }, [setOutPage]);

  const renderPage = useCallback((index, page) => (
    <div
      onMouseOut={pageOutHandler}
      onMouseOver={() => pageOverHandler(page.id)}
    >
      <PageActions
        order={page.order}
        pageID={page.id}
      />
      <div
        ref={getPageRef(page.id)}
        className={classNames.page}
        data-id={page.id}
        data-order={page.order}
        id={`presentation-page-${page.id.toString()}`}
        style={pageStyle}
      >
        <Page
          items={page.items}
          page={page}
          pageIndex={index}
          style={pageContainerStyle}
        />
        {selectionPageId === page.id && selectionBox && (
          <SelectionBox selectionBox={selectionBox} />
        )}
      </div>
    </div>
  ), [
    getPageRef,
    pageContainerStyle,
    pageOutHandler,
    pageOverHandler,
    pageStyle,
    selectionBox,
    selectionPageId,
  ]);

  return (
    <main
      className={classNames.mainWrapper}
    >
      <DraggableLayer
        pageRefs={refs.current}
      />
      <div
        ref={setViewPort}
        className={classNames.viewport}
        data-zoom={zoom}
      >
        <div
          ref={canvasRef}
          className={classNames.canvas}
        >
          {viewPort && (
            <Virtuoso
              ref={virtuosoRef}
              computeItemKey={getPageId}
              customScrollParent={viewPort}
              data={pages}
              increaseViewportBy={OVERSCAN_PAGE_COUNT * zoomedHeight}
              itemContent={renderPage}
              rangeChanged={setRenderedPageRange}
              style={listStyle}
              totalListHeightChanged={handleTotalListHeightChange}
            />
          )}
          <PageAdder />
        </div>
      </div>
      <div className="bottom-actions-container">
        {isSlidesListType(slidesListType, 'NAVIGATOR') && <SlidesNavigatorToggle />}
        <ZoomControls />
      </div>
      {contextMenuProps
        && (
          <ContextMenu
            exceptionalClasses={['contextMenu-button']}
            height={height}
            item={findItemById(contextMenuProps.id, pages)}
            items={findItemsOnPage(contextMenuProps.pageID, pages)}
            onClickOutside={() => setContextMenuProps(null)}
            position={contextMenuProps.position}
            width={width}
          />
        )}
    </main>
  );
};

export default Scene;
