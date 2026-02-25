import * as icons from '../../utils/icons';
import { useSelectedElements, useTranslatedTexts } from '../../utils/hooks';
import { usePropStore } from '../../contexts/PropContext';
import { useBuilderStore } from '../../contexts/BuilderContext';
import generateId from '../../utils/generateId';

const DraggableItemActions = () => {
  const {
    DELETE_ITEM,
    DUPLICATE_ITEM,
    ITEM_SETTINGS,
    LOCK_ITEM,
  } = useTranslatedTexts();

  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const onItemChange = usePropStore(state => state.onItemChange);
  const onItemRemove = usePropStore(state => state.onItemRemove);
  const onItemAdd = usePropStore(state => state.onItemAdd);

  const setActiveElements = useBuilderStore(state => state.setActiveElements);
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);

  const selectedElements = useSelectedElements();
  const item = selectedElements[0]; // ACTIONS WORKS ONLY FOR ONE ITEM

  const { isLocked } = item;

  const changeLockStatus = () => {
    onAnEventTrigger(isLocked ? 'unlockReportItem' : 'lockReportItem', item.itemType);
    onItemChange({ id: item.id }, { isLocked: isLocked ? false : true });
    if (!isLocked) {
      setIsRightPanelOpen(false);
    }
  };

  const deleteItem = () => {
    setIsRightPanelOpen(false);
    resetActiveElements();
    onItemRemove(item);
    onAnEventTrigger('removeItem', item.itemType);
  };

  const duplicateItem = () => {
    const itemID = generateId();
    onItemAdd({
      ...item,
      id: itemID,
      left: item.left + 50,
      top: item.top + 50,
    });
    onAnEventTrigger('duplicateItem', item.itemType);
    setActiveElements(itemID, true);
    setIsRightPanelOpen(true);
  };

  const openSettings = () => {
    setIsRightPanelOpen(true);
  };

  if (isLocked) {
    return (
      <div className="report-item-toolbar isLocked forLocked">
        <button
          className="report-item-toolbar-item"
          onClick={changeLockStatus}
          type="button"
        >
          <icons.lock className="toolbar-icon" />
        </button>
      </div>
    );
  }
  return (
    <div className="report-item-toolbar">
      <button
        className="report-item-toolbar-item"
        onClick={openSettings}
        title={ITEM_SETTINGS}
        type="button"
      >
        <icons.settings className="toolbar-icon" />
      </button>
      <button
        className="report-item-toolbar-item"
        onClick={duplicateItem}
        title={DUPLICATE_ITEM}
        type="button"
      >
        <icons.duplicate className="toolbar-icon" />
      </button>
      <button
        className="report-item-toolbar-item"
        onClick={changeLockStatus}
        title={LOCK_ITEM}
        type="button"
      >
        <icons.unlock className="toolbar-icon" />
      </button>
      <button
        className="report-item-toolbar-item error"
        onClick={deleteItem}
        title={DELETE_ITEM}
        type="button"
      >
        <icons.trash className="toolbar-icon" />
      </button>
    </div>
  );
};

export default DraggableItemActions;
