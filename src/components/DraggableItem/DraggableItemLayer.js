import { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReportItemRenderer from '../Builder/ReportItemRenderer';
import { getCoordinatesFromMatches, getCorrectDroppedOffsetValue, getMatchesForItem } from '../../utils/functions';
import ItemPositioner from '../ItemPositioner';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';
import { useSelectedElements } from '../../utils/hooks';

const getDraggedItem = ({ defaultItem = {}, details }, item) => ({
  ...defaultItem,
  ...details,
  ...item,
  id: 'temp',
});

const DraggableItemLayer = ({
  collectedProps = {},
  pageRefs = {},
}) => {
  const {
    currentOffset,
    initialOffset,
    isDragging,
    item,
  } = collectedProps;
  const zoom = useBuilderStore(state => state.zoom);
  const guides = useBuilderStore(state => state.guides);

  const acceptedItems = usePropStore(state => state.acceptedItems);
  const itemAccessor = usePropStore(state => state.itemAccessor);

  const referenceItem = useMemo(() => {
    const _item = item.id ? item : getDraggedItem(acceptedItems[item.itemType], item);

    // for a element that is dragging to the left panel
    if (!_item.pageID) {
      const element = document.elementFromPoint(currentOffset.x, currentOffset.y);
      if (element && element.closest('.jfReport-page')) {
        const pageID = element.closest('.jfReport-page').getAttribute('data-id');
        return { ..._item, pageID };
      }
    }

    return _item;
  }, [
    item,
    acceptedItems,
    currentOffset.x,
    currentOffset.y,
  ]);

  const { pageID } = referenceItem;

  const refCoords = useMemo(() => {
    if (pageID) {
      const dropTargetPosition = pageRefs[pageID].current.getBoundingClientRect();
      const coords = getCorrectDroppedOffsetValue(
        currentOffset,
        initialOffset,
        dropTargetPosition,
        zoom,
      );
      const newItem = { ...referenceItem, ...coords };
      const newMatches = getMatchesForItem(newItem, guides, zoom);
      const { left, top } = getCoordinatesFromMatches(newItem, newMatches, zoom);
      return {
        x: (left * zoom) + dropTargetPosition.left,
        y: (top * zoom) + dropTargetPosition.top,
      };
    }
    return {
      x: currentOffset.x,
      y: currentOffset.y,
    };
  }, [
    currentOffset,
    initialOffset,
    referenceItem,
    pageID,
    pageRefs,
    zoom,
    guides,
  ]);

  const getItemStyle = useCallback(({ x, y }, { height, width }) => {
    return {
      cursor: 'grabbing',
      height,
      left: x,
      outlineColor: '#4277ff',
      pointerEvents: 'none',
      position: 'fixed',
      top: y,
      transform: `scale(${zoom})`,
      transformOrigin: '0 0',
      width,
      zIndex: 100,
    };
  }, [zoom]);

  const selectedElements = useSelectedElements();

  const hasActiveItems = selectedElements.length > 0;

  // for a element is added from the left panel
  const activeElements = hasActiveItems ? selectedElements : [referenceItem];

  return activeElements.map(activeItem => {
    const coords = hasActiveItems ? {
      x: refCoords.x - ((referenceItem.left - activeItem.left) * zoom),
      y: refCoords.y - ((referenceItem.top - activeItem.top) * zoom),
    } : refCoords;

    const exactItem = hasActiveItems ? activeItem : referenceItem;

    return (
      <ItemPositioner
        key={activeItem.id}
        classNames="reportItem isDraggingLayerElement"
        style={getItemStyle(coords, exactItem)}
      >
        <ReportItemRenderer item={exactItem}>
          {ReportItem => (
            <ReportItem
              isDragging={isDragging}
              item={exactItem}
              itemAccessor={itemAccessor}
              zoom={zoom}
            />
          )}
        </ReportItemRenderer>
      </ItemPositioner>
    );
  });
};

DraggableItemLayer.propTypes = {
  collectedProps: PropTypes.shape({
    currentOffset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    initialOffset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    isDragging: PropTypes.bool,
    item: PropTypes.shape({}),
    itemType: PropTypes.string,
  }),
  pageRefs: PropTypes.shape({}),
};

export default memo(DraggableItemLayer);
