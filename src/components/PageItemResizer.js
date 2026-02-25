import {
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

const exceptionalClassesForClickOutside = ['contextMenu-itemLabel', 'contextMenu-item'];
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
  'report-item-toolbar',
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
  item,
  onResize,
  onResizeStop,
}) => {
  const zoom = useBuilderStore(state => state.zoom);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const isMultipleItemSelected = useBuilderStore(state => state.activeElements.length > 1);
  const isTextEditorOpen = useBuilderStore(state => state.isTextEditorOpen);

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
    resetActiveElements();
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const itemPositionerStyle = useMemo(() => ({
    height: Math.round(item.height * zoom),
    left: Math.round(item.left * zoom),
    pointerEvents: 'none',
    position: 'absolute',
    top: Math.round(item.top * zoom),
    touchAction: 'none',
    width: Math.round(item.width * zoom),
  }), [item.height, item.left, item.top, item.width, zoom]);

  const size = useMemo(() => ({
    height: Math.round(item.height * zoom),
    width: Math.round(item.width * zoom),
  }), [item.height, item.width, zoom]);

  const { isLocked } = item;

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
      {!isMultipleItemSelected && <DraggableItemActions />}
      {isTextEditorOpen && (
        <TextEditorToolbar
          itemWidth={item.width * zoom}
        />
      )}
    </ItemPositioner>,
    document.querySelector(`.jfReport-page[data-id="${item.pageID}"]`),
  );
};

export default PageItemResizer;
