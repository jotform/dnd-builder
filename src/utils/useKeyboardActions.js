/* eslint-disable complexity */
import { useRef, useState } from 'react';
import { useBuilderStore } from '../contexts/BuilderContext';
import { usePropStore } from '../contexts/PropContext';
import { findItemById, getDimensions, getMostVisiblePage } from './functions';
import { useEventListener, useSelectedElements } from './hooks';
import { EVENT_IGNORED_FIELDS, EVENT_IGNORED_ROLES } from '../constants/eventIgnoredRoles';
import generateId from './generateId';

const useKeyboardActions = () => {
  const [itemToPaste, setItemToPaste] = useState(null);
  const keyDownCount = useRef(null);

  const activeElements = useBuilderStore(state => state.activeElements);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const setActiveElements = useBuilderStore(state => state.setActiveElements);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);

  const pages = usePropStore(state => state.pages);
  const onItemAdd = usePropStore(state => state.onItemAdd);
  const onItemRemove = usePropStore(state => state.onItemRemove);
  const onItemChange = usePropStore(state => state.onItemChange);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);

  const isMultipleItemSelected = activeElements.length > 1;

  const foundItem = findItemById(activeElements.length ? activeElements[0] : null, pages);

  const selectedItems = useSelectedElements();
  const moveItemWithKeyboard = (event, direction, value) => {
    event.preventDefault();
    selectedItems.forEach(item => {
      if (item.isLocked) {
        return false;
      }
      onItemChange(
        { id: item.id },
        {
          ...getDimensions(item),
          [direction]: item[direction] + value,
          pageID: item.pageID,
        },
      );
    });
  };

  const selectNextOrPrevElement = (event, deletedItem) => {
    if (event.preventDefault) event.preventDefault();
    const referenceItem = deletedItem ? deletedItem : foundItem;

    const page = pages.find(_page => _page.id === referenceItem.pageID);
    if (!page || (page && !page.items.length)) return resetActiveElements();
    const { items } = page;

    const currentIndex = items.findIndex(item => item.id === referenceItem.id);

    // Pages are not updated in time so here is an unnecessary check
    if (items.length === 1 && deletedItem) {
      return resetActiveElements();
    }

    if (event.shiftKey) {
      if (items[currentIndex - 1]) setActiveElements(items[currentIndex - 1].id);
      else setActiveElements(items[items.length - 1].id);
    } else if (items[currentIndex + 1]) {
      setActiveElements(items[currentIndex + 1].id);
    } else setActiveElements(items[0].id);
  };

  const onItemRemoveFromPage = e => {
    // Firefox updates browser history on backspace
    e.preventDefault();
    if (isRightPanelOpen) return;
    if (isMultipleItemSelected) return;
    if (foundItem.isLocked) {
      return false;
    }
    resetActiveElements();
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
    setActiveElements(itemID);
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
        setActiveElements(itemID);
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
    case 'Escape': return resetActiveElements();
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
    || EVENT_IGNORED_FIELDS.some(field => e.target.closest(field))
  );

  const handleKeyboardEvent = e => {
    const shouldPaste = itemToPaste && e.key === 'v' && e.metaKey;

    if (shouldSuppressKeyboardEvent(e)) {
      return;
    }

    if (activeElements.length && !shouldPaste) {
      const arrowKeyCodes = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowBottom'];
      if (arrowKeyCodes.includes(e.key)) e.preventDefault();
      keyboardActions(e);
    } else if (shouldPaste) {
      handlePaste();
    }
  };

  useEventListener('keydown', handleKeyboardEvent);
  useEventListener('keyup', () => { keyDownCount.current = 0; });
};

export default useKeyboardActions;
