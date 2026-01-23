import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useEventListener, useTranslatedTexts } from '../../utils/hooks';
import {
  collisionCheck,
  getContainerPositions,
  moveArrayItem,
} from '../../utils/functions';

import withClickOutside from '../withClickOutside';
import { usePropStore } from '../../contexts/PropContext';
import { useIcons } from '../../hooks/useIcons';

const ContextMenu = ({
  height = 1,
  item = {},
  items = [],
  onClickOutside = () => {},
  position = {},
  width = 1,
}) => {
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const onItemChange = usePropStore(state => state.onItemChange);
  const onItemRemove = usePropStore(state => state.onItemRemove);
  const onPageChange = usePropStore(state => state.onPageChange);
  const [positions, setPositions] = useState(position);
  const container = useRef(null);
  const itemIndex = items.findIndex(_item => _item.id === item.id);
  // Will be mutated.
  const orderArray = items.map(_item => _item.id);

  const removeFunc = () => {
    // TODO :: should listen to scroll event, not wheel
    onClickOutside();
  };

  useEventListener('wheel', removeFunc);

  useLayoutEffect(() => {
    setPositions(prev => {
      const newPosition = getContainerPositions(container.current, prev);
      return {
        ...prev,
        x: newPosition.x,
        y: newPosition.y,
      };
    });
  }, []);

  const moveToFront = () => {
    if (items.length !== itemIndex + 1) {
      moveArrayItem(orderArray, itemIndex, items.length - 1);
      onPageChange({
        id: item.pageID,
      }, { items: JSON.stringify(orderArray) });
    }
    onClickOutside();
  };

  const moveToBack = () => {
    if (itemIndex !== 0) {
      moveArrayItem(orderArray, itemIndex, 0);
      onPageChange({
        id: item.pageID,
      }, { items: JSON.stringify(orderArray) });
    }
    onClickOutside();
  };

  const moveForward = () => {
    if (items.length !== itemIndex + 1) {
      const colluddedItemIndex = collisionCheck(item, items, itemIndex, 1);
      if (colluddedItemIndex !== null) {
        moveArrayItem(orderArray, itemIndex, colluddedItemIndex);
      } else {
        moveArrayItem(orderArray, itemIndex, itemIndex + 1);
      }
      onPageChange({
        id: item.pageID,
      }, { items: JSON.stringify(orderArray) });
    }
    onClickOutside();
  };

  const moveBackward = () => {
    if (itemIndex !== 0) {
      const colluddedItemIndex = collisionCheck(item, items, itemIndex, -1);
      if (colluddedItemIndex) {
        moveArrayItem(orderArray, itemIndex, colluddedItemIndex);
      } else {
        moveArrayItem(orderArray, itemIndex, itemIndex - 1);
      }
      onPageChange({
        id: item.pageID,
      }, { items: JSON.stringify(orderArray) });
    }

    onClickOutside();
  };

  const deleteItem = () => {
    onItemRemove(item);
    onClickOutside();
    onAnEventTrigger('removeItem', item.itemType);
  };

  const lockOrUnlockItem = () => {
    onItemChange({ id: item.id }, { isLocked: item.isLocked ? false : true });
    onClickOutside();
  };

  const fitToPage = () => {
    let _height = height;
    let _width = width;
    // Keep image ratio on fit
    if (item.itemType === 'image') {
      if (item.height > item.width) {
        _width = (item.width * _height) / item.height;
      } else if (item.width > item.height) {
        _height = (item.height * _width) / item.width;
      }
    }

    onItemChange({ id: item.id }, {
      height: _height,
      left: 0,
      top: 0,
      width: _width,
    });

    onClickOutside();
    onAnEventTrigger('fitToPage', item.itemType);
  };

  const {
    DELETE, FIT_TO_PAGE, LOCK_ITEM,
    MOVE_BACKWARDS, MOVE_FORWARDS,
    MOVE_TO_BACK, MOVE_TO_FRONT, UNLOCK_ITEM,
  } = useTranslatedTexts();

  const {
    enterFullscreen: EnterFullscreenIcon,
    lock: LockIcon,
    moveToBack: MoveToBackIcon,
    moveToBackward: MoveToBackwardIcon,
    moveToForward: MoveToForwardIcon,
    moveToFront: MoveToFrontIcon,
    trash: TrashIcon,
    unlock: UnlockIcon,
  } = useIcons();

  const menuItems = [
    { func: moveToFront, icon: <MoveToFrontIcon />, text: MOVE_TO_FRONT },
    { func: moveForward, icon: <MoveToForwardIcon />, text: MOVE_FORWARDS },
    { func: moveBackward, icon: <MoveToBackwardIcon />, text: MOVE_BACKWARDS },
    { func: moveToBack, icon: <MoveToBackIcon />, text: MOVE_TO_BACK },
    {
      func: lockOrUnlockItem,
      icon: item.isLocked ? (
        <UnlockIcon className="icon-lock" />
      ) : (
        <LockIcon className="icon-lock" />
      ),
      text: item.isLocked ? UNLOCK_ITEM : LOCK_ITEM,
    },
    {
      func: fitToPage, icon: <EnterFullscreenIcon className="icon-lock" />, text: FIT_TO_PAGE,
    },
    {
      class: ' isDanger', func: deleteItem, icon: <TrashIcon />, text: DELETE,
    },
  ];

  return (
    <div
      ref={container}
      className="contextMenu-wrapper"
      style={{
        left: positions.x,
        top: positions.y,
      }}
    >
      {menuItems.map(menuItem => {
        const btnClass = `contextMenu-button jfReportButton${menuItem.class ? menuItem.class : ''}`;
        return (
          <button
            key={menuItem.text}
            className={btnClass}
            onClick={menuItem.func}
            type="button"
          >
            <span className="contextMenu-icon">
              {menuItem.icon}
            </span>
            {menuItem.text}
          </button>
        );
      })}
    </div>
  );
};

ContextMenu.propTypes = {
  height: PropTypes.number,
  item: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string,
    isLocked: PropTypes.bool,
    itemType: PropTypes.string,
    left: PropTypes.number,
    pageID: PropTypes.string,
    top: PropTypes.number,
    width: PropTypes.number,
  }),
  items: PropTypes.arrayOf(PropTypes.shape({
    height: PropTypes.number,
    // id: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
  })),
  onClickOutside: PropTypes.func,
  position: PropTypes.shape({}),
  width: PropTypes.number,
};

const PortalContext = props => createPortal(<ContextMenu {...props} />, document.body);

export default withClickOutside(PortalContext);
