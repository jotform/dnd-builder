/* eslint-disable max-len */
import { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd-cjs';
import { getEmptyImage } from 'react-dnd-html5-backend-cjs';
import isEqual from 'lodash.isequal';
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

const exceptionalClassesForClickOutside = [
  'contextMenu-itemLabel', 'contextMenu-item', 'text-toolbar', 'image-toolbar', 'page-toolbar', 'text-toolbar-button', 'image-toolbar-button', 'toolbar-button', 'toolbar-dropdown', 'toolbar-input',
];
const reportItemStyle = {
  height: '100%',
  width: '100%',
};

const DraggableItem = ({
  children,
  guides,
  isMultipleItemSelected,
  isResize,
  isRightPanelOpen,
  isSelected,
  isTextEditorOpen,
  item,
  matches,
  onAnEventTrigger,
  onItemAdd,
  onItemChange,
  onItemRemove,
  onItemResize,
  setActiveElement,
  setContextMenuProps,
  setIsResize,
  setIsRightPanelOpen,
  setMatches,
  zoom,
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

  const [{ isDragging }, drag, preview] = useDrag({
    begin: () => {
      if (!isSelected) select();
      addEventListenerForSidebar();
    },
    canDrag: (!item.isLocked && !isTextEditorOpen) ? true : false,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      removeEventListenerForSidebar();
    },
    isDragging: () => {
      return (isMultipleItemSelected && isSelected) || (!isMultipleItemSelected && isSelected);
    },
    item: {
      height,
      id,
      left,
      top,
      type: DRAGGABLE_ITEM_TYPE,
      width,
    },
  });

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

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
    if (width !== stateWidth || height !== stateHeight || left !== stateLeft || top !== stateTop) {
      setResizeSize({
        height,
        left,
        top,
        width,
      });
    }
  }, [width, height, left, top]);

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

  // Helper function to check if element or any parent has exceptional classes
  const hasExceptionalClass = element => {
    let currentElement = element;
    while (currentElement && currentElement !== document.body) {
      if (currentElement.classList) {
        const hasClass = Array.from(currentElement.classList)
          .some(xClass => exceptionalClassesForClickOutside.includes(xClass));
        if (hasClass) return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  };

  const onClickOutside = event => {
    // clickoutside should not work for scrollbar
    const viewPort = document.querySelector('.jfReport-viewport');
    const { clientHeight, offsetHeight } = viewPort;
    const headerHeight = window.innerHeight - offsetHeight;
    if (event.clientY - headerHeight >= clientHeight
        || hasExceptionalClass(event.target)) {
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
          onClick={select}
          onContextMenu={onContextMenuClick}
          onDoubleClick={onDoubleClick}
          onDragStart={duplicateWithAltKey}
          onKeyDown={() => {}}
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
  isRightPanelOpen: PropTypes.bool,
  isSelected: PropTypes.bool,
  isTextEditorOpen: PropTypes.bool,
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
  onAnEventTrigger: PropTypes.func,
  onItemAdd: PropTypes.func,
  onItemChange: PropTypes.func,
  onItemRemove: PropTypes.func,
  onItemResize: PropTypes.func,
  setActiveElement: PropTypes.func,
  setContextMenuProps: PropTypes.func,
  setIsResize: PropTypes.func,
  setIsRightPanelOpen: PropTypes.func,
  setMatches: PropTypes.func,
  zoom: PropTypes.number,
};

DraggableItem.defaultProps = {
  children: null,
  guides: {},
  isMultipleItemSelected: false,
  isResize: false,
  isRightPanelOpen: false,
  isSelected: false,
  isTextEditorOpen: false,
  item: {},
  matches: {},
  onAnEventTrigger: () => {},
  onItemAdd: () => {},
  onItemChange: () => {},
  onItemRemove: () => {},
  onItemResize: () => {},
  setActiveElement: () => {},
  setContextMenuProps: () => {},
  setIsResize: () => {},
  setIsRightPanelOpen: () => {},
  setMatches: () => {},
  zoom: 1,
};

// avoid unnecessary renders while resizing
const areEqual = (prevProps, nextProps) => {
  if (prevProps.hashCode !== nextProps.hashCode) return false;
  if (!isEqual(prevProps.item, nextProps.item)) return false;
  if (prevProps.matches !== nextProps.matches) return false;
  if (prevProps.isTextEditorOpen !== nextProps.isTextEditorOpen) return false;
  if ((prevProps.isSelected && nextProps.isSelected) || prevProps.isResize !== nextProps.isResize) {
    return false;
  }
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  return true;
};

export default memo(DraggableItem, areEqual);
