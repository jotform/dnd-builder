import {
  useEffect, useState, memo, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemPositioner from '../ItemPositioner';
import { DRAGGABLE_ITEM_TYPE } from '../../constants/itemTypes';
import {
  getStyles, getPosition, isSelectedItem, getMatchesForItem, roundPositionValues,
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

const reportItemStyle = {
  height: '100%',
  width: '100%',
};

const DraggableItem = ({
  children = null,
  item = {},
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
  const setMatches = useBuilderStore(state => state.setMatches);
  const guides = useBuilderStore(state => state.guides);
  const zoom = useBuilderStore(state => state.zoom);

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

  const onResizeStop = () => {
    setIsResize(false);
    setMatches({});
    onItemResize(item, roundPositionValues({
      height: stateHeight,
      left: stateLeft,
      top: stateTop,
      width: stateWidth,
    }));
  };

  const onResize = (deltaWidth, deltaHeight, direction) => {
    setIsResize(true);

    const isLeft = /left/i.test(direction);
    const isTop = /top/i.test(direction);
    const isRight = /right/i.test(direction);
    const isBottom = /bottom/i.test(direction);

    const activeItem = {
      ...item,
      height: item.height + deltaHeight,
      left: isLeft ? item.left - deltaWidth : item.left,
      top: isTop ? item.top - deltaHeight : item.top,
      width: item.width + deltaWidth,
    };

    const newMatches = getMatchesForItem(activeItem, guides, zoom, direction);
    setMatches(newMatches);

    const snapX = newMatches?.x?.intersection / zoom;
    const snapY = newMatches?.y?.intersection / zoom;

    const rightEdge = item.left + item.width;
    const bottomEdge = item.top + item.height;

    const getWidth = () => {
      if (!snapX) return activeItem.width;
      return isRight ? snapX - item.left : rightEdge - snapX;
    };

    const getHeight = () => {
      if (!snapY) return activeItem.height;
      return isBottom ? snapY - item.top : bottomEdge - snapY;
    };

    const getLeft = () => {
      if (snapX && isLeft) return snapX;
      return isLeft ? activeItem.left : item.left;
    };

    const getTop = () => {
      if (snapY && isTop) return snapY;
      return isTop ? activeItem.top : item.top;
    };

    setResizeSize({
      height: getHeight(),
      left: getLeft(),
      top: getTop(),
      width: getWidth(),
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
    <ErrorBoundary item={item}>
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
