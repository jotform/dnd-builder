/* eslint-disable complexity */
import {
  useCallback,
  createRef,
  Fragment,
  useEffect,
  useRef,
  useState,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import * as classNames from '../../constants/classNames';
import ContextMenu from './ContextMenu';
import PageActions from './PageActions';
import PageAdder from './PageAdder';
import ZoomControls from './ZoomControls';
import { useBuilderContext } from '../../utils/builderContext';
import { usePropContext } from '../../utils/propContext';
import {
  DRAGGABLE_ITEM_TYPE,
  DROPPABLE_ITEM_TYPE,
} from '../../constants/itemTypes';
import Page from './Page';
import {
  calculateGuidePositions,
  findItemById,
  findItemsOnPage,
  getCorrectDroppedOffsetValue,
  getCorrectDroppedOffsetValueBySnap,
  getMostVisiblePage,
  getSelectedItems,
} from '../../utils/functions';
import { useEventListener } from '../../utils/hooks';
import DraggableItemLayer from '../DraggableItem/DraggableItemLayer';
import generateId from '../../utils/generateId';
import { EVENT_IGNORED_ROLES } from '../../constants/eventIgnoredRoles';

const Scene = ({
  additionalPageItems,
  hashCode,
  itemAccessor,
  lastScrollPosition,
  onItemAdd,
  onItemChange,
  onItemMove,
  onItemRemove,
  onItemResize,
  onItemsMove,
  onPageAdd,
  onPageChange,
  onPageDuplicate,
  onPageOrdersChange,
  onPageRemove,
  pages,
}) => {
  const pageCount = pages.length;
  /* Builder Context */
  const {
    activeElement,
    contextMenuProps,
    isRightPanelOpen,
    setActiveElement,
    setContextMenuProps,
    setEditedElement,
    setIsRightPanelOpen,
    zoom,
  } = useBuilderContext();
  const {
    acceptedItems,
    disableInteraction,
    onAnEventTrigger,
    settings,
  } = usePropContext();
  const [itemToPaste, setItemToPaste] = useState(null);
  const isHeaderHidden = useRef(false);

  const pageStyles = useRef({});
  const pageContainerStyles = useRef({});
  const viewPortRef = useRef({});

  /* Page Refs */
  const refs = pages.reduce((acc, curr) => {
    acc[curr.id] = createRef(null);
    return acc;
  }, {});

  const isMultipleItemSelected = activeElement !== null && activeElement.length > 1;

  /* Calculate snap guides */
  const [guides, setGuides] = useState({});
  const keyDownCount = useRef(null);
  useEffect(() => {
    const _guides = pages.reduce((acc, page) => {
      const _pageGuides = {};
      if (refs[page.id]) {
        const pageRef = refs[page.id];
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
    setGuides(_guides);
  }, [pages, zoom]);
  /* When an item dropped */
  const dropped = useCallback(
    (pageID, {
      id, itemType, type, ...additionalData
    }, monitor, ref) => {
      const pageClient = ref.current.getBoundingClientRect();
      const coords = getCorrectDroppedOffsetValue(
        monitor,
        pageClient,
        zoom,
      );
      switch (type) {
        case DROPPABLE_ITEM_TYPE: {
          const itemID = generateId();
          onItemAdd({
            ...acceptedItems[itemType].details,
            id: itemID,
            pageID,
            ...coords,
            ...additionalData,
          });
          onAnEventTrigger('reportItemAdd', itemType);
          setActiveElement(itemID);
          setIsRightPanelOpen(true);
          break;
        }
        case DRAGGABLE_ITEM_TYPE: {
          const dragCoords = getCorrectDroppedOffsetValueBySnap(coords, guides, id, pages, zoom);
          if (isMultipleItemSelected) {
            const leftDifference = additionalData.left - dragCoords.left;
            const topDifference = additionalData.top - dragCoords.top;
            const items = activeElement.reduce((acc, curr) => {
              const tempItem = findItemById(curr, pages);
              acc[curr] = {
                id: curr,
                left: tempItem.left - leftDifference,
                pageID,
                top: tempItem.top - topDifference,
              };
              return acc;
            }, {});
            onItemsMove({
              items,
            });
          } else {
            onItemMove({
              id,
              pageID,
              ...dragCoords,
            });
          }
          break;
        }
        default: {
          throw new Error('You have to be specify item type');
        }
      }
    },
    [pages, guides, zoom, activeElement],
  );

  useEffect(() => {
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, []); // set last scroll position after changing mode

  useEffect(() => {
    if (document.body.classList.contains('hideHeader') && isHeaderHidden) {
      document.body.classList.remove('hideHeader');
    }
  }, []); // reset hideHeader

  const foundItem = findItemById(activeElement === null ? null : activeElement[0], pages);

  const selectedItems = getSelectedItems(activeElement, pages);
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

  const onScroll = e => {
    const { scrollTop } = e.currentTarget;
    const hiddenHeaderHeight = 70;
    const headerHidingLimit = isHeaderHidden ? 230 : 300;
    if (scrollTop > headerHidingLimit + hiddenHeaderHeight && !isHeaderHidden.current) {
      isHeaderHidden.current = true;
      document.body.classList.add('hideHeader');
    } else if (scrollTop < headerHidingLimit && isHeaderHidden.current) {
      isHeaderHidden.current = false;
      document.body.classList.remove('hideHeader');
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
      <DraggableItemLayer
        guides={guides}
        itemAccessor={itemAccessor}
        pageRefs={refs}
        pages={pages}
      />

      <div
        ref={viewPortRef}
        className={classNames.viewport}
        data-zoom={zoom}
        onScroll={onScroll}
      >
        <div
          className={classNames.canvas}
        >
          {pages.map((page, index) => (
            // TODO: This part can be moved into a different component
            <Fragment key={page.id}>
              <PageActions
                disableInteraction={disableInteraction}
                onAnEventTrigger={onAnEventTrigger}
                onPageAdd={onPageAdd}
                onPageDuplicate={onPageDuplicate}
                onPageOrdersChange={onPageOrdersChange}
                onPageRemove={onPageRemove}
                order={page.order}
                pageCount={pageCount}
                pageID={page.id}
                pages={pages}
                setEditedElement={setEditedElement}
                setIsRightPanelOpen={setIsRightPanelOpen}
              />
              <div
                key={`page_${page.id}`}
                ref={refs[page.id]}
                className={classNames.page}
                data-id={page.id}
                data-order={page.order}
                style={pageStyles.current}
              >
                <Page
                  activeElement={activeElement}
                  additionalPageItems={additionalPageItems}
                  guides={guides[page.id]}
                  hashCode={hashCode}
                  itemAccessor={itemAccessor}
                  items={page.items}
                  // TODO: dont use inline functions
                  onDrop={(item, monitor) => dropped(page.id, item, monitor, refs[page.id])}
                  onItemAdd={onItemAdd}
                  onItemChange={onItemChange}
                  onItemRemove={onItemRemove}
                  onItemResize={onItemResize}
                  page={page}
                  pageIndex={index}
                  pageRef={refs[page.id]}
                  style={pageContainerStyles.current}
                />
              </div>
            </Fragment>
          ))}
          <PageAdder
            onPageAdd={onPageAdd}
            pageCount={pageCount}
          />
        </div>
      </div>
      <ZoomControls
        mode="customize"
        pages={pages}
      />
      {contextMenuProps
        && (
          <ContextMenu
            exceptionalClasses={['contextMenu-button']}
            height={height}
            item={findItemById(contextMenuProps.id, pages)}
            items={findItemsOnPage(contextMenuProps.pageID, pages)}
            onAnEventTrigger={onAnEventTrigger}
            onClickOutside={() => setContextMenuProps(null)}
            onItemChange={onItemChange}
            onItemRemove={onItemRemove}
            onPageChange={onPageChange}
            position={contextMenuProps.position}
            width={width}
          />
        )}
    </main>
  );
};

Scene.propTypes = {
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  lastScrollPosition: PropTypes.number,
  onItemAdd: PropTypes.func,
  onItemChange: PropTypes.func,
  onItemMove: PropTypes.func,
  onItemRemove: PropTypes.func,
  onItemResize: PropTypes.func,
  onItemsMove: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageOrdersChange: PropTypes.func,
  onPageRemove: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

Scene.defaultProps = {
  additionalPageItems: [],
  hashCode: '',
  itemAccessor: () => {},
  lastScrollPosition: 0,
  onItemAdd: () => {},
  onItemChange: () => {},
  onItemMove: () => {},
  onItemRemove: () => {},
  onItemResize: () => {},
  onItemsMove: () => {},
  onPageAdd: () => {},
  onPageChange: () => {},
  onPageDuplicate: () => {},
  onPageOrdersChange: () => {},
  onPageRemove: () => {},
  pages: [],
};

export default memo(Scene);
