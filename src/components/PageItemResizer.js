import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Resizable } from 're-resizable';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { resizeStaticProps } from '../constants/staticProps';
import TextEditorToolbar from './TextEditor/CustomToolbar';

import DraggableItemActions from './DraggableItem/DraggableItemActions';
import ItemPositioner from './ItemPositioner';
import withClickOutside from './withClickOutside';
import { useBuilderStore } from '../contexts/BuilderContext';
import { isSelectedItem } from '../utils/functions';

const ResizableWithClickOutside = withClickOutside(Resizable);

const enableResize = {
  bottom: true,
  bottomLeft: true,
  bottomRight: true,
  left: true,
  right: true,
  top: true,
  topLeft: true,
  topRight: true,
};
const lockAspectRatioTypes = ['image', 'icon'];
const exceptionalClasses = [
  'reportHandle',
  'reportItemMenu',
  'jfReport-pane',
  'pageSettingSideBtn',
  'reportItemWrapper',
  'reportRotater',
  'forZoom',
  'ql-toolbar',
  'jSheetContextMenu',
  'reset-default-contextMenu',
];

const PageItemResizer = ({
  changeLockStatus,
  deleteItem,
  duplicateItem,
  isDragging,
  item,
  onClickOutside,
  onResize,
  onResizeStop,
  pageID,
  stateHeight,
  stateLeft,
  stateTop,
  stateWidth,
}) => {
  const zoom = useBuilderStore(state => state.zoom);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const activeElement = useBuilderStore(state => state.activeElement);
  const isTextEditorOpen = useBuilderStore(state => state.isTextEditorOpen);

  const isSelected = isSelectedItem(item.id, activeElement);
  const isMultipleItemSelected = activeElement !== null && activeElement.length > 1;

  const requestRef = useRef();
  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  const handleKeyUp = e => {
    if (!e.shiftKey) setLockAspectRatio(false);
  };

  const handleKeyDown = e => {
    if (e.shiftKey) setLockAspectRatio(true);
  };

  const seriousResize = (deltaWidth, deltaHeight, direction) => {
    return () => {
      onResize(deltaWidth, deltaHeight, direction);
      requestRef.current = undefined;
    };
  };

  const onResizeStart = e => {
    e.preventDefault();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  };

  const onResizeRAF = (e, direction, ref, { height: deltaHeight, width: deltaWidth }) => {
    if (!requestRef.current) {
      requestRef.current = global
        .requestAnimationFrame(
          seriousResize(
            Math.round(deltaWidth * (1 / zoom)),
            Math.round(deltaHeight * (1 / zoom)),
            direction,
          ),
        );
    }
  };

  const onResizeEnd = (e, direction, ref, { height: deltaHeight, width: deltaWidth }) => {
    onResizeStop(
      Math.round(deltaWidth * (1 / zoom)),
      Math.round(deltaHeight * (1 / zoom)),
      direction,
    );
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };

  const itemPositionerStyle = useMemo(() => ({
    height: Math.round(stateHeight * zoom),
    left: Math.round(stateLeft * zoom),
    pointerEvents: 'none',
    position: 'absolute',
    top: Math.round(stateTop * zoom),
    touchAction: 'none',
    width: Math.round(stateWidth * zoom),
  }), [stateHeight, stateLeft, stateTop, stateWidth, zoom]);

  const size = useMemo(() => ({
    height: Math.round(stateHeight * zoom),
    width: Math.round(stateWidth * zoom),
  }), [stateHeight, stateWidth, zoom]);

  const openSettings = useCallback(() => {
    setActiveElement(item.id);
    setIsRightPanelOpen(true);
  }, [item.id, setIsRightPanelOpen, setActiveElement]);

  const { isLocked } = item;

  if (isDragging || !isSelected) return null;
  return createPortal(
    <ItemPositioner
      style={itemPositionerStyle}
    >
      <ResizableWithClickOutside
        className={classNames(
          'reportItemResizer',
          { hideVerticalHandle: !(item.height > 50) },
          { hideHorizontalHandle: !(item.width > 50) },
        )}
        enable={!item.isLocked && enableResize}
        exceptionalClasses={exceptionalClasses}
        lockAspectRatio={lockAspectRatioTypes.includes(item.itemType) || lockAspectRatio}
        onClickOutside={onClickOutside}
        onResize={onResizeRAF}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeEnd}
        size={size}
        {...resizeStaticProps}
        withClickOutsideWrapperClass={`reportItemResizer-wrapper${isLocked ? ' isLocked' : ''}`}
      />
      <DraggableItemActions
        changeLockStatus={changeLockStatus}
        deleteItem={deleteItem}
        duplicateItem={duplicateItem}
        isLocked={item.isLocked}
        isMultipleItemSelected={isMultipleItemSelected}
        openSettings={openSettings}
      />
      <TextEditorToolbar
        isTextEditorOpen={isTextEditorOpen}
        itemWidth={stateWidth * zoom}
      />
    </ItemPositioner>,
    document.querySelector(`.jfReport-page[data-id="${pageID}"]`),
  );
};

export default PageItemResizer;
