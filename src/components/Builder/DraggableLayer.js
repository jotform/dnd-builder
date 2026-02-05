import PropTypes from 'prop-types';
import { useDragLayer } from 'react-dnd';
import DraggableItemLayer from '../DraggableItem/DraggableItemLayer';

const DraggableLayer = ({
  pageRefs = {},
}) => {
  const collectedProps = useDragLayer(monitor => ({
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
  }));

  if (!collectedProps.currentOffset || !collectedProps.isDragging) {
    return null;
  }

  return (
    <DraggableItemLayer
      collectedProps={collectedProps}
      pageRefs={pageRefs}
    />
  );
};

DraggableLayer.propTypes = {
  pageRefs: PropTypes.shape({}),
};

export default DraggableLayer;
