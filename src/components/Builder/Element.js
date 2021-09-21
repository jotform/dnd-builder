import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd-cjs';
import { getEmptyImage } from 'react-dnd-html5-backend-cjs';
import { DROPPABLE_ITEM_TYPE } from '../../constants/itemTypes';
import {
  getMostVisiblePage, getExactIconType, getAvailableCoordinate,
} from '../../utils/functions';
import generateId from '../../utils/generateId';
import * as icons from '../../utils/icons';

const Element = ({
  acceptedItems,
  icon,
  iconType,
  itemType,
  onAnEventTrigger,
  onItemAdd,
  setActiveElement,
  setIsRightPanelOpen,
  title,
  zoom,
  ...additionalData
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: {
      itemType,
      type: DROPPABLE_ITEM_TYPE,
      ...additionalData,
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  });

  const onElementClick = () => {
    const itemID = generateId();
    const page = getMostVisiblePage();
    let left = 0;
    let top = 0;
    if (page) { // for test
      [left, top] = getAvailableCoordinate(page, zoom);
    }
    onItemAdd({
      ...acceptedItems[itemType].details,
      ...additionalData,
      id: itemID,
      left,
      pageID: page.id,
      top,
    });
    onAnEventTrigger('reportItemAdd', itemType);
    setActiveElement(itemID);
    setIsRightPanelOpen(true);
  };

  const onElementOtherActions = () => {};

  const exactIconType = getExactIconType(iconType);
  const Icon = icons[exactIconType] ? icons[exactIconType] : icons.label;
  return (
    <>
      <div
        ref={drag}
        className="toolItem d-flex a-center js-toolItem"
        onClick={onElementClick}
        onKeyDown={onElementOtherActions}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        title={title}
      >
        <span className="toolItem-icon d-flex j-center a-center">
          {icon ? icon : (
            <Icon className={`jfReportSVG icon-question icon-${iconType}`} />
          )}
        </span>
        <span className="js-toolItemName toolItem-name d-flex a-center">
          { title }
        </span>
      </div>
    </>
  );
};

Element.propTypes = {
  acceptedItems: PropTypes.shape({}),
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  iconType: PropTypes.string,
  itemType: PropTypes.string,
  onAnEventTrigger: PropTypes.func,
  onItemAdd: PropTypes.func,
  setActiveElement: PropTypes.func,
  setIsRightPanelOpen: PropTypes.func,
  title: PropTypes.string,
  zoom: PropTypes.number,
};

Element.defaultProps = {
  acceptedItems: {},
  icon: null,
  iconType: '',
  itemType: '',
  onAnEventTrigger: () => {},
  onItemAdd: () => {},
  setActiveElement: () => {},
  setIsRightPanelOpen: () => {},
  title: '',
  zoom: 1,
};

export default memo(Element);
