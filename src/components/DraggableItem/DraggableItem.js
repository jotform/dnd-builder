import { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemPositioner from '../ItemPositioner';
import { DRAGGABLE_ITEM_TYPE } from '../../constants/itemTypes';
import {
  getStyles,
  getPosition, calculateGuidePositions, proximityListener,
} from '../../utils/functions';
import PageItemResizer from '../PageItemResizer';
import ErrorBoundary from '../ErrorBoundary';
import * as classNames from '../../constants/classNames';
import generateId from '../../utils/generateId';
import {
  addEventListenerForSidebar,
  removeEventListenerForSidebar,
} from '../../utils/scrollZoneFunctions';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';

const exceptionalClassesForClickOutside = ['contextMenu-itemLabel', 'contextMenu-item'];
const reportItemStyle = {
  height: '100%',
  width: '100%',
};

const DraggableItem = ({
  children = null,
  guides = {},
  isMultipleItemSelected = false,
  isResize = false,
  isSelected = false,
  item = {},
  matches = {},
  setIsResize = () => {},
  setMatches = () => {},
}) => {
  const {
    height,
    id,
    isLocked,
    left,
    pageID,
    top,
    width,
  } = item;

  const [
    {
      height: stateHeight,
      left: stateLeft,
      top: stateTop,
      width: stateWidth,
    },
    setResizeSize,
  ] = useState({
    height,
    left,
    top,
    width,
  });

  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const onItemAdd = usePropStore(state => state.onItemAdd);
  const onItemChange = usePropStore(state => state.onItemChange);
  const onItemRemove = usePropStore(state => state.onItemRemove);
  const onItemResize = usePropStore(state => state.onItemResize);
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setContextMenuProps = useBuilderStore(state => state.setContextMenuProps);
  const zoom = useBuilderStore(state => state.zoom);
  const isTextEditorOpen = useBuilderStore(state => state.isTextEditorOpen);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);

  const select = event => {
    if (!isSelected) {
      if (!event || !event.metaKey) {
        if (isLocked) {
          setActiveElement(id, false);
          setIsRightPanelOpen(false);
        } else {
          setActiveElement(id);
        }
      } else {
        setActiveElement(id, undefined, true);
      }
    }
  };

  const canDrag = !item.isLocked && !isTextEditorOpen;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    canDrag: () => canDrag,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult[id]) {
        const { left: dropLeft, top: dropTop } = dropResult[id];
        setResizeSize(prev => {
          return {
            height: prev.height,
            left: dropLeft,
            top: dropTop,
            width: prev.width,
          };
        });
      }
      removeEventListenerForSidebar();
    },
    isDragging: () => (isMultipleItemSelected && isSelected) || (!isMultipleItemSelected && isSelected),
    item: () => {
      select();
      addEventListenerForSidebar();
      return item;
    },
    type: DRAGGABLE_ITEM_TYPE,
  }), [
    item,
    canDrag,
    id,
    isMultipleItemSelected,
    isSelected,
  ]);

  useEffect(() => {
    if (preview) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [preview]);

  useEffect(() => {
    if (!isResize) {
      setResizeSize(prev => {
        if (prev.left !== left || prev.top !== top || prev.width !== width || prev.height !== height) {
          return {
            ...prev,
            height,
            left,
            top,
            width,
          };
        }

        return prev;
      });
    }
  }, [left, top, width, height, isResize]);

  const onResizeStop = (deltaWidth, deltaHeight, direction) => {
    const activeItem = {
      ...item,
      height: item.height + deltaHeight,
      width: item.width + deltaWidth,
    };
    if (/left/i.test(direction)) activeItem.left = activeItem.left - deltaWidth;
    if (/top/i.test(direction)) activeItem.top = activeItem.top - deltaHeight;
    let newActiveBoxLeft = activeItem.left;
    let newActiveBoxTop = activeItem.top;
    Object.keys(matches).forEach(axis => {
      const { activeBoxGuides, matchedArray, proximity } = matches[axis];
      const activeBoxProximityIndex = proximity.activeBoxIndex;
      const matchedBoxProximityIndex = proximity.matchedBoxIndex;
      if (axis === 'x') {
        if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
          newActiveBoxLeft = activeItem.left - proximity.value;
        } else {
          newActiveBoxLeft = activeItem.left + proximity.value;
        }
      } else if (activeBoxGuides[activeBoxProximityIndex]
        > matchedArray[matchedBoxProximityIndex]) {
        newActiveBoxTop = activeItem.top - proximity.value;
      } else {
        newActiveBoxTop = activeItem.top + proximity.value;
      }
    });

    let newResizeSize = {
      height: activeItem.height,
      left: activeItem.left,
      top: activeItem.top,
      width: activeItem.width,
    };

    if (!(/top/i.test(direction) && /left/i.test(direction))) {
      newResizeSize = {
        ...newResizeSize,
        height: newResizeSize.height + (newActiveBoxTop - activeItem.top),
        width: newResizeSize.width + (newActiveBoxLeft - activeItem.left),
      };
    }
    if (/top/i.test(direction) && newActiveBoxTop !== newResizeSize.top) {
      newResizeSize.top = newActiveBoxTop;
    }
    if (/left/i.test(direction) && newActiveBoxLeft !== newResizeSize.left) {
      newResizeSize.left = newActiveBoxLeft;
    }
    setIsResize(false);
    onItemResize(item, newResizeSize);
  };

  const onResize = (deltaWidth, deltaHeight, direction) => {
    if (!isResize) { setIsResize(true); }
    const activeItem = {
      ...item,
      height: item.height + deltaHeight,
      width: item.width + deltaWidth,
    };
    if (/left/i.test(direction)) activeItem.left = activeItem.left - deltaWidth;
    if (/top/i.test(direction)) activeItem.top = activeItem.top - deltaHeight;
    const _guides = {
      ...guides,
      [item.id]: {
        ...guides[item.id],
        x: calculateGuidePositions(activeItem, 'x', zoom),
        y: calculateGuidePositions(activeItem, 'y', zoom),
      },
    };
    setMatches(proximityListener(item.id, _guides));
    setResizeSize({
      height: activeItem.height,
      left: activeItem.left,
      top: activeItem.top,
      width: activeItem.width,
    });
  };

  const deleteItem = () => {
    setIsRightPanelOpen(false);
    setActiveElement(null);
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
    setActiveElement(itemID);
    if (!isRightPanelOpen) {
      setIsRightPanelOpen(true);
    }
  };

  const onClickOutside = event => {
    // clickoutside should not work for scrollbar
    const viewPort = document.querySelector('.jfReport-viewport');
    const { clientHeight, offsetHeight } = viewPort;
    const headerHeight = window.innerHeight - offsetHeight;
    if (event.clientY - headerHeight >= clientHeight
        || Array.from(event.target.classList)
          .some(xClass => exceptionalClassesForClickOutside.includes(xClass))) {
      return;
    }
    setIsRightPanelOpen(false);
    setActiveElement(null);
  };

  const onContextMenuClick = e => {
    if (
      e.target.contentEditable === 'true'
      || isTextEditorOpen
    ) {
      // Dont override behaviour on text edits.
      return;
    }

    e.preventDefault();
    onAnEventTrigger('openContextMenu', item.itemType);
    setContextMenuProps({
      id,
      pageID,
      position: getPosition(e),
    });
  };

  const onDoubleClick = e => {
    if (
      e.target.contentEditable === 'true'
      || isTextEditorOpen
    ) {
      // Dont override behaviour on text edits.
      return;
    }

    setIsRightPanelOpen(true);
  };

  const duplicateWithAltKey = e => {
    if (e.altKey) {
      const itemID = generateId();
      const itemToAdd = item;
      setTimeout(() => {
        onItemAdd({
          ...itemToAdd,
          id: itemID,
          left: itemToAdd.left,
          top: itemToAdd.top,
        });
        onAnEventTrigger('duplicateItem', itemToAdd.itemType);
      });
    }
  };

  const changeLockStatus = () => {
    onAnEventTrigger(item.isLocked ? 'unlockReportItem' : 'lockReportItem', item.itemType);
    onItemChange({ id: item.id }, { isLocked: item.isLocked ? false : true });
    if (!item.isLocked) {
      setActiveElement(item.id, false);
      setIsRightPanelOpen(false);
    }
  };

  return (
    <ErrorBoundary>
      <ItemPositioner
        classNames={`reportItemWrapper${isSelected ? ' isSelected' : ''}`}
        style={{
          ...getStyles(left, top, isDragging),
          height: stateHeight,
          left: stateLeft,
          top: stateTop,
          width: stateWidth,
        }}
      >
        <div
          ref={drag}
          className={`${classNames.reportItem}${isLocked ? ' isLocked' : ''}`}
          onContextMenu={onContextMenuClick}
          onDoubleClick={onDoubleClick}
          onDragStart={duplicateWithAltKey}
          onMouseDown={select}
          style={reportItemStyle}
        >
          {children}
        </div>
      </ItemPositioner>
      <PageItemResizer
        changeLockStatus={changeLockStatus}
        deleteItem={deleteItem}
        duplicateItem={duplicateItem}
        isDragging={isDragging}
        isMultipleItemSelected={isMultipleItemSelected}
        isRightPanelOpen={isRightPanelOpen}
        isSelectedElement={isSelected}
        isTextEditorOpen={isTextEditorOpen}
        item={item}
        onClickOutside={onClickOutside}
        onResize={onResize}
        onResizeStop={onResizeStop}
        pageID={pageID}
        setActiveElement={setActiveElement}
        setIsRightPanelOpen={setIsRightPanelOpen}
        stateHeight={stateHeight}
        stateLeft={stateLeft}
        stateTop={stateTop}
        stateWidth={stateWidth}
        zoom={zoom}
      />
    </ErrorBoundary>
  );
};

DraggableItem.propTypes = {
  children: PropTypes.any,
  guides: PropTypes.shape({}),
  isMultipleItemSelected: PropTypes.bool,
  isResize: PropTypes.bool,
  isSelected: PropTypes.bool,
  item: PropTypes.shape({
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    id: PropTypes.string,
    isLocked: PropTypes.bool,
    itemType: PropTypes.string,
    left: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    pageID: PropTypes.string,
    top: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  matches: PropTypes.shape({}),
  setIsResize: PropTypes.func,
  setMatches: PropTypes.func,
};

export default memo(DraggableItem);
