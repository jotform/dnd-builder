import {
  useEffect, useState, memo, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemPositioner from '../ItemPositioner';
import { DRAGGABLE_ITEM_TYPE } from '../../constants/itemTypes';
import { getStyles, getPosition, isSelectedItem } from '../../utils/functions';
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

const reportItemStyle = {
  height: '100%',
  width: '100%',
};

const DraggableItem = ({
  children = null,
  item = {},
  handleMatches,
  getIntersectionsFromMatches,
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
  const onItemResize = usePropStore(state => state.onItemResize);

  const activeElements = useBuilderStore(state => state.activeElements);
  const setActiveElements = useBuilderStore(state => state.setActiveElements);
  const setContextMenuProps = useBuilderStore(state => state.setContextMenuProps);
  const isTextEditorOpen = useBuilderStore(state => state.isTextEditorOpen);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const setIsResize = useBuilderStore(state => state.setIsResize);

  const isSelected = isSelectedItem(item.id, activeElements);

  const select = event => {
    if (!isSelected) {
      if (!event || !event.metaKey) { // Single item selected
        setActiveElements(id, true);
        if (isLocked) {
          setIsRightPanelOpen(false);
        }
      } else {
        // Multiple items selected
        setActiveElements(id, false, false);
        setIsRightPanelOpen(false);
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
    isDragging: () => isSelected,
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
    isSelected,
  ]);

  useEffect(() => {
    if (preview) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [preview]);

  useEffect(() => {
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
  }, [left, top, width, height]);

  const onResizeStop = (deltaWidth, deltaHeight, direction) => {
    const activeItem = {
      ...item,
      height: item.height + deltaHeight,
      width: item.width + deltaWidth,
    };
    if (/left/i.test(direction)) activeItem.left = activeItem.left - deltaWidth;
    if (/top/i.test(direction)) activeItem.top = activeItem.top - deltaHeight;
    const { newActiveBoxLeft, newActiveBoxTop } = getIntersectionsFromMatches(activeItem);
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
    setIsResize(true);
    const activeItem = {
      ...item,
      height: item.height + deltaHeight,
      width: item.width + deltaWidth,
    };
    if (/left/i.test(direction)) activeItem.left = activeItem.left - deltaWidth;
    if (/top/i.test(direction)) activeItem.top = activeItem.top - deltaHeight;
    handleMatches(activeItem);
    setResizeSize({
      height: activeItem.height,
      left: activeItem.left,
      top: activeItem.top,
      width: activeItem.width,
    });
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

  const modifiedItem = useMemo(() => ({
    ...item,
    height: stateHeight,
    left: stateLeft,
    top: stateTop,
    width: stateWidth,
  }), [item, stateHeight, stateLeft, stateTop, stateWidth]);

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
      {!isDragging && isSelected && (
        <PageItemResizer
          item={modifiedItem}
          onResize={onResize}
          onResizeStop={onResizeStop}
        />
      )}
    </ErrorBoundary>
  );
};

DraggableItem.propTypes = {
  children: PropTypes.any,
  getIntersectionsFromMatches: PropTypes.func,
  handleMatches: PropTypes.func,
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
};

export default memo(DraggableItem);
