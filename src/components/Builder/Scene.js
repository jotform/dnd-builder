/* eslint-disable complexity */
import {
  createRef,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
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
  getItemsInSelectionBox,
} from '../../utils/functions';
import DraggableLayer from './DraggableLayer';
import useKeyboardActions from '../../utils/useKeyboardActions';

const Scene = () => {
  const pages = usePropStore(state => state.pages);
  const settings = usePropStore(state => state.settings);
  const contextMenuProps = useBuilderStore(state => state.contextMenuProps);

  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setActiveElementsSelection = useBuilderStore(state => state.setActiveElementsSelection);
  const setContextMenuProps = useBuilderStore(state => state.setContextMenuProps);
  const setGuides = useBuilderStore(state => state.setGuides);

  const zoom = useBuilderStore(state => state.zoom);

  // Marquee selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectionPageId, setSelectionPageId] = useState(null);
  const selectionStartRef = useRef(null);
  const lastScrollPosition = useBuilderStore(state => state.lastScrollPosition);

  const pageStyles = useRef({});
  const pageContainerStyles = useRef({});
  const viewPortRef = useRef({});

  /* Page Refs */
  const refs = useRef(pages.reduce((acc, curr) => {
    acc[curr.id] = createRef(null);
    return acc;
  }, {}));

  // Handle keyboard actions
  useKeyboardActions();

  // Update refs when new pages are added
  useEffect(() => {
    pages.forEach(page => {
      if (!refs.current[page.id]) {
        refs.current[page.id] = createRef(null);
      }
    });
  }, [pages]);

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

  useEffect(() => {
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, [lastScrollPosition]); // set last scroll position after changing mode

  // Marquee selection handlers
  const handleCanvasMouseDown = useCallback(e => {
    // Selection starts with left click only
    if (e.button !== 0) return;

    const { target } = e;

    // Don't start selection if clicking on an item or interactive element
    const activeElementsSelectors = [
      '.reportItem',
      '.reportItemWrapper',
      '.pageActions',
      '.jfReport-addSlide',
      '[role="button"]',
      'button',
      '.contextMenu',
    ];

    if (activeElementsSelectors.some(selector => target.closest(selector))) {
      return;
    }

    // Find the page element from the click target
    const pageElement = target.closest('.jfReport-page') || target.closest('[id*="presentation-page-"]');
    if (!pageElement) return;

    const pageId = pageElement.getAttribute('data-id') || pageElement.getAttribute('id').replace('presentation-page-', '');
    if (!pageId) return;

    // Prevent text selection during drag
    e.preventDefault();

    const pageRect = pageElement.getBoundingClientRect();
    const startX = e.clientX - pageRect.left;
    const startY = e.clientY - pageRect.top;

    selectionStartRef.current = {
      pageRect,
      startX,
      startY,
    };
    setSelectionPageId(pageId);
    setSelectionBox({
      endX: startX,
      endY: startY,
      startX,
      startY,
    });
    setIsSelecting(true);

    // Clear current selection when starting new marquee
    resetActiveElements();
  }, [resetActiveElements]);

  const handleCanvasMouseMove = useCallback(e => {
    if (!isSelecting || !selectionStartRef.current) return;

    const { pageRect, startX, startY } = selectionStartRef.current;

    // Calculate end position (clamped to page bounds)
    const endX = Math.max(0, Math.min(e.clientX - pageRect.left, pageRect.width));
    const endY = Math.max(0, Math.min(e.clientY - pageRect.top, pageRect.height));

    setSelectionBox({
      endX,
      endY,
      startX,
      startY,
    });
  }, [isSelecting]);

  const handleCanvasMouseUp = useCallback(() => {
    if (!isSelecting || !selectionBox || !selectionPageId) {
      setIsSelecting(false);
      setSelectionBox(null);
      selectionStartRef.current = null;
      return;
    }

    // Find the page and its items
    const page = pages.find(p => p.id === selectionPageId);

    if (page && page.items) {
      const selectedItemIds = getItemsInSelectionBox(selectionBox, page.items, zoom);
      if (selectedItemIds.length > 0) {
        setActiveElementsSelection(selectedItemIds);
      }
    }

    // Reset selection state
    setIsSelecting(false);
    setSelectionBox(null);
    setSelectionPageId(null);
    selectionStartRef.current = null;
  }, [isSelecting, selectionBox, selectionPageId, pages, zoom, setActiveElementsSelection]);

  // Add global mouse event listeners for marquee selection
  useEffect(() => {
    if (isSelecting) {
      document.body.style.cursor = 'crosshair';
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
      return () => {
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isSelecting, handleCanvasMouseMove, handleCanvasMouseUp]);

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
          className={classNames.canvas}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
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
                {selectionPageId === page.id && (
                  <SelectionBox
                    isSelecting={isSelecting}
                    selectionBox={selectionBox}
                  />
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
