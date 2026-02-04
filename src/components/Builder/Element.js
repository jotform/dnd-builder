import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DROPPABLE_ITEM_TYPE } from '../../constants/itemTypes';
import {
  getMostVisiblePage, getExactIconType, getAvailableCoordinate,
} from '../../utils/functions';
import generateId from '../../utils/generateId';
import * as icons from '../../utils/icons';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';

const Element = ({
  icon = null,
  iconType = '',
  itemType = '',
  title = '',
  ...additionalData
}) => {
  const acceptedItems = usePropStore(state => state.acceptedItems);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const onItemAdd = usePropStore(state => state.onItemAdd);
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setActiveElements = useBuilderStore(state => state.setActiveElements);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const zoom = useBuilderStore(state => state.zoom);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),

    item: () => {
      resetActiveElements();
      return {
        itemType,
        type: DROPPABLE_ITEM_TYPE,
        ...additionalData,
      };
    },

    type: DROPPABLE_ITEM_TYPE,
  }), [itemType, additionalData]);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

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
    setActiveElements(itemID, true);
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
        style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.5 : 1 }}
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
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  iconType: PropTypes.string,
  itemType: PropTypes.string,
  title: PropTypes.string,
};

export default memo(Element);
