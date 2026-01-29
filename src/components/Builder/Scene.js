/* eslint-disable complexity */
import {
  createRef,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as classNames from '../../constants/classNames';
import ContextMenu from './ContextMenu';
import PageActions from './PageActions';
import PageAdder from './PageAdder';
import ZoomControls from './ZoomControls';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';
import Page from './Page';
import {
  calculateGuidePositions,
  findItemById,
  findItemsOnPage,
  getMostVisiblePage,
} from '../../utils/functions';
import { useActiveElement, useEventListener } from '../../utils/hooks';
import generateId from '../../utils/generateId';
import { EVENT_IGNORED_ROLES } from '../../constants/eventIgnoredRoles';
import DraggableLayer from './DraggableLayer';

const Scene = () => {
  const pages = usePropStore(state => state.pages);
  const onItemAdd = usePropStore(state => state.onItemAdd);
  const onItemRemove = usePropStore(state => state.onItemRemove);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const settings = usePropStore(state => state.settings);
  const onItemChange = usePropStore(state => state.onItemChange);

  const activeElement = useBuilderStore(state => state.activeElement);
  const contextMenuProps = useBuilderStore(state => state.contextMenuProps);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setContextMenuProps = useBuilderStore(state => state.setContextMenuProps);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const zoom = useBuilderStore(state => state.zoom);

  const [itemToPaste, setItemToPaste] = useState(null);
  const lastScrollPosition = useBuilderStore(state => state.lastScrollPosition);

  const pageStyles = useRef({});
  const pageContainerStyles = useRef({});
  const viewPortRef = useRef({});

  /* Page Refs */
  const refs = useRef(pages.reduce((acc, curr) => {
    acc[curr.id] = createRef(null);
    return acc;
  }, {}));

  // Update refs when new pages are added
  useEffect(() => {
    pages.forEach(page => {
      if (!refs.current[page.id]) {
        refs.current[page.id] = createRef(null);
      }
    });
  }, [pages]);

  const isMultipleItemSelected = activeElement !== null && activeElement.length > 1;

  /* Calculate snap guides */
  const keyDownCount = useRef(null);

  const guides = useMemo(() => {
    return pages.reduce((acc, page) => {
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
    }, {});
  }, [pages, zoom]);

  useEffect(() => {
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, [lastScrollPosition]); // set last scroll position after changing mode

  const foundItem = findItemById(activeElement === null ? null : activeElement[0], pages);

  const selectedItems = useActiveElement();
  const moveItemWithKeyboard = (event, direction, value) => {
    event.preventDefault();
    selectedItems.forEach(item => {
      if (item.isLocked) {
        return false;
      }
      onItemChange(
        { id: item.id },
        {
          ...item,
          [direction]: item[direction] + value,
        },
      );
    });
  };

  const selectNextOrPrevElement = (event, deletedItem) => {
    if (event.preventDefault) event.preventDefault();
    const referenceItem = deletedItem ? deletedItem : foundItem;

    const page = pages.find(_page => _page.id === referenceItem.pageID);
    if (!page || (page && !page.items.length)) return setActiveElement(null);
    const { items } = page;

    const currentIndex = items.findIndex(item => item.id === referenceItem.id);

    // Pages are not updated in time so here is an unnecessary check
    if (items.length === 1 && deletedItem) {
      return setActiveElement(null);
    }

    if (event.shiftKey) {
      if (items[currentIndex - 1]) setActiveElement(items[currentIndex - 1].id);
      else setActiveElement(items[items.length - 1].id);
    } else if (items[currentIndex + 1]) {
      setActiveElement(items[currentIndex + 1].id);
    } else setActiveElement(items[0].id);
  };

  const onItemRemoveFromPage = e => {
    // Firefox updates browser history on backspace
    e.preventDefault();
    if (isMultipleItemSelected) return;
    if (foundItem.isLocked) {
      return false;
    }
    setActiveElement(null);
    onItemRemove(foundItem);
    selectNextOrPrevElement({ shiftKey: false }, foundItem);
    onAnEventTrigger('removeItem', foundItem.itemType);
  };

  const handlePaste = () => {
    if (isMultipleItemSelected) return;
    const itemID = generateId();
    const pageID = getMostVisiblePage(true);
    const offset = itemToPaste.pageID === pageID ? 50 : 0;

    const item = {
      ...itemToPaste,
      id: itemID,
      left: itemToPaste.left + offset,
      pageID,
      top: itemToPaste.top + offset,
    };

    onItemAdd(item);

    onAnEventTrigger('pasteItem', itemToPaste.itemType);
    setActiveElement(itemID);
    // set as last reference to paste
    setItemToPaste(item);
  };

  const keyboardActions = event => {
    const {
      key,
      metaKey,
      shiftKey,
    } = event;

    if (metaKey) {
      if (key === 'l') {
        // Lock
        if (isMultipleItemSelected) return;
        event.preventDefault(); // Dont focus to URL bar
        onAnEventTrigger(
          foundItem.isLocked ? 'unlockReportItem' : 'lockReportItem',
          foundItem.itemType,
        );
        onItemChange(
          { id: foundItem.id },
          { isLocked: foundItem.isLocked ? false : true },
        );
        return;
      }

      if (key === 'c' || key === 'x') {
        if (isMultipleItemSelected) return;
        // Copy or Cut
        if (key === 'x') {
          onItemRemoveFromPage(event);
          onAnEventTrigger('cutItem', foundItem.itemType);
        } else {
          onAnEventTrigger('copyItem', foundItem.itemType);
        }

        setItemToPaste(foundItem);
        return;
      }

      if (foundItem && key === 'd') {
        if (isMultipleItemSelected) return;
        // Duplicate
        event.preventDefault();
        const itemID = generateId();
        onItemAdd({
          ...foundItem,
          id: itemID,
          left: foundItem.left + 50,
          top: foundItem.top + 50,
        });
        onAnEventTrigger('duplicateItem', foundItem.itemType);
        setActiveElement(itemID);
        if (!isRightPanelOpen) {
          setIsRightPanelOpen(true);
        }
        return;
      }
    }

    keyDownCount.current++;
    const movementValue = shiftKey ? 10 : 1 + keyDownCount.current;

    // Others
    switch (key) {
    case 'Backspace': return onItemRemoveFromPage(event);
    case 'Delete': return onItemRemoveFromPage(event);
    case 'Escape': return setActiveElement(null);
    case 'ArrowLeft': return moveItemWithKeyboard(event, 'left', -movementValue);
    case 'ArrowUp': return moveItemWithKeyboard(event, 'top', -movementValue);
    case 'ArrowRight': return moveItemWithKeyboard(event, 'left', movementValue);
    case 'ArrowDown': return moveItemWithKeyboard(event, 'top', movementValue);
    case 'Tab': return selectNextOrPrevElement(event);
    default:
    }
  };

  const shouldSuppressKeyboardEvent = e => (
    EVENT_IGNORED_ROLES.some(role => e.target.closest(`[role=${role}]`))
  );

  const handleKeyboardEvent = e => {
    const shouldPaste = itemToPaste && e.key === 'v' && e.metaKey;

    if (shouldSuppressKeyboardEvent(e)) {
      return;
    }

    if (activeElement && !shouldPaste) {
      const arrowKeyCodes = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowBottom'];
      if (arrowKeyCodes.includes(e.key)) e.preventDefault();
      keyboardActions(e);
    } else if (shouldPaste) {
      handlePaste();
    }
  };

  useEventListener('keydown', handleKeyboardEvent);
  useEventListener('keyup', () => { keyDownCount.current = 0; });

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
        guides={guides}
        pageRefs={refs.current}
      />
      <div
        ref={viewPortRef}
        className={classNames.viewport}
        data-zoom={zoom}
      >
        <div
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
                style={pageStyles.current}
              >
                <Page
                  guides={guides}
                  items={page.items}
                  page={page}
                  pageIndex={index}
                  style={pageContainerStyles.current}
                />
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
