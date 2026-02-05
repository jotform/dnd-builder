/* eslint-disable complexity */
import {
  createRef,
  Fragment,
  useEffect,
  useRef,
} from 'react';
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
} from '../../utils/functions';
import DraggableLayer from './DraggableLayer';
import useKeyboardActions from '../../utils/useKeyboardActions';
import useMarqueeSelection from '../../utils/useMarqueeSelection';

const Scene = () => {
  const pages = usePropStore(state => state.pages);
  const settings = usePropStore(state => state.settings);
  const contextMenuProps = useBuilderStore(state => state.contextMenuProps);
  const setContextMenuProps = useBuilderStore(state => state.setContextMenuProps);
  const setGuides = useBuilderStore(state => state.setGuides);
  const zoom = useBuilderStore(state => state.zoom);
  const lastScrollPosition = useBuilderStore(state => state.lastScrollPosition);

  const pageStyles = useRef({});
  const pageContainerStyles = useRef({});
  const viewPortRef = useRef({});
  const canvasRef = useRef(null);

  /* Page Refs */
  const refs = useRef(pages.reduce((acc, curr) => {
    acc[curr.id] = createRef(null);
    return acc;
  }, {}));

  // Custom hooks
  useKeyboardActions();
  const { selectionBox, selectionPageId } = useMarqueeSelection(canvasRef);

  // Update refs when new pages are added
  useEffect(() => {
    pages.forEach(page => {
      if (!refs.current[page.id]) {
        refs.current[page.id] = createRef(null);
      }
    });
  }, [pages]);

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
  }, [pages, zoom, setGuides]);

  // Restore scroll position after mode change
  useEffect(() => {
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, [lastScrollPosition]);

  const { reportLayoutHeight = 794, reportLayoutWidth = 1123 } = settings;

  // TODO: Some strange shit is going on here on first render
  let width = parseInt(reportLayoutWidth, 10);
  let height = parseInt(reportLayoutHeight, 10);
  width = Number.isNaN(width) ? 1 : width;
  height = Number.isNaN(height) ? 1 : height;
  const zoomToUse = Number.isNaN(zoom) ? 1 : zoom;

  pageStyles.current = {
    height: parseFloat((height * zoomToUse).toFixed(1)),
    width: parseFloat((width * zoomToUse).toFixed(1)),
  };
  pageContainerStyles.current = {
    height,
    transform: `scale(${zoomToUse})`,
    transformOrigin: '0 0',
    width,
  };

  return (
    <main // Builder.js
      className={classNames.mainWrapper}
    >
      <DraggableLayer
        pageRefs={refs.current}
      />
      <div
        ref={viewPortRef}
        className={classNames.viewport}
        data-zoom={zoom}
      >
        <div
          ref={canvasRef}
          className={classNames.canvas}
        >
          {pages.map((page, index) => (
            // TODO: This part can be moved into a different component
            <Fragment key={page.id}>
              <PageActions
                order={page.order}
                pageID={page.id}
              />
              <div
                key={`page_${page.id}`}
                ref={refs.current[page.id]}
                className={classNames.page}
                data-id={page.id}
                data-order={page.order}
                id={`presentation-page-${page.id.toString()}`}
                style={{ ...pageStyles.current, position: 'relative' }}
              >
                <Page
                  items={page.items}
                  page={page}
                  pageIndex={index}
                  style={pageContainerStyles.current}
                />
                {selectionPageId === page.id && selectionBox && (
                  <SelectionBox selectionBox={selectionBox} />
                )}
              </div>
            </Fragment>
          ))}
          <PageAdder />
        </div>
      </div>
      <ZoomControls />
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
