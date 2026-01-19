import { memo } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { useDragLayer } from 'react-dnd';
import ReportItemRenderer from '../Builder/ReportItemRenderer';
import { proximityListener, calculateGuidePositions } from '../../utils/functions';
import ItemPositioner from '../ItemPositioner';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropContext } from '../../contexts/PropContext';
import getMergedItem from '../../utils/getMergedItem';

const layerStyles = ({ x, y }) => ({
  left: x,
  pointerEvents: 'none',
  position: 'fixed',
  top: y,
  zIndex: 100,
});

const getDraggedItem = ({ defaultItem = {}, details }, item) => ({
  ...defaultItem,
  ...details,
  ...item,
  id: 'temp',
});

const getMemoizedDraggedItem = memoizeOne(getDraggedItem);

const getAdditionalItems = memoizeOne((activeElems, __itemId, _pages, _acceptedItems) => {
  if (activeElems === null || activeElems.length === 1) return [];
  const index = activeElems.findIndex(aE => aE === __itemId);
  const act = [...activeElems.slice(0, index), ...activeElems.slice(index + 1)];
  const items = act.map(_i => {
    const _item = _pages.reduce((acc, curr) => {
      if (acc) {
        return acc;
      }
      return curr.items.find(el => el.id === _i);
    }, undefined);
    const defItem = (_acceptedItems[_item.itemType]
      && _acceptedItems[_item.itemType].defaultItem);
    return { ...defItem, ..._item };
  });
  return items;
});

function getItemStyles(initialOffset, currentOffset, ref, pageGuides, item, zoom) {
  if (ref.current) {
    const dropTargetPosition = ref.current.getBoundingClientRect();
    const { x: finalX, y: finalY } = currentOffset;
    const { x: initialX, y: initialY } = initialOffset;
    const newYposition = finalY > initialY
      ? (initialY + (finalY - initialY)) - dropTargetPosition.top
      : initialY - (initialY - finalY) - dropTargetPosition.top;

    const newXposition = finalX > initialX
      ? (initialX + (finalX - initialX)) - dropTargetPosition.left
      : initialX - (initialX - finalX) - dropTargetPosition.left;

    const newItem = {
      ...item,
      left: newXposition / zoom,
      top: newYposition / zoom,
    };
    const _guides = {
      ...pageGuides,
      [item.id]: {
        ...pageGuides[item.id],
        x: calculateGuidePositions(newItem, 'x', zoom),
        y: calculateGuidePositions(newItem, 'y', zoom),
      },
    };

    const match = proximityListener(item.id, _guides);
    let newActiveBoxLeft = newXposition;
    let newActiveBoxTop = newYposition;
    const haveMatch = Object.keys(match).length > 0;
    const haveXMatch = haveMatch && match.x;
    const haveYMatch = haveMatch && match.y;
    Object.keys(match).forEach(axis => {
      const { activeBoxGuides, matchedArray, proximity } = match[axis];
      const activeBoxProximityIndex = proximity.activeBoxIndex;
      const matchedBoxProximityIndex = proximity.matchedBoxIndex;
      if (axis === 'x') {
        if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
          newActiveBoxLeft = newItem.left - proximity.value;
        } else {
          newActiveBoxLeft = newItem.left + proximity.value;
        }
      } else if (activeBoxGuides[activeBoxProximityIndex]
        > matchedArray[matchedBoxProximityIndex]) {
        newActiveBoxTop = newItem.top - proximity.value;
      } else {
        newActiveBoxTop = newItem.top + proximity.value;
      }
    });
    return {
      x: (newActiveBoxLeft * (haveXMatch ? zoom : 1)) + dropTargetPosition.left,
      y: (newActiveBoxTop * (haveYMatch ? zoom : 1)) + dropTargetPosition.top,
    };
  }
}

const DraggableItemLayer = ({
  guides = {},
  itemAccessor = () => {},
  pageRefs = {},
  pages = [],
}) => {
  const {
    currentOffset,
    initialOffset,
    isDragging,
    item,
  } = useDragLayer(monitor => ({
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
  }));

  const activeElement = useBuilderStore(state => state.activeElement);
  const zoom = useBuilderStore(state => state.zoom);

  const { acceptedItems } = usePropContext();

  if (!currentOffset || !isDragging) {
    return null;
  }
  let draggedItem = pages.reduce((acc, curr) => {
    if (acc) {
      return acc;
    }
    return curr.items.find(el => el.id === item.id);
  }, undefined);

  let pageID;
  if (draggedItem) {
    pageID = draggedItem.pageID;
  } else {
    draggedItem = getMemoizedDraggedItem(acceptedItems[item.itemType], item);
  }
  const element = document.elementFromPoint(currentOffset.x, currentOffset.y);
  if (element && element.closest('.jfReport-page')) { // add polyfill if will we use that one
    pageID = element.closest('.jfReport-page').getAttribute('data-id');
    if (!draggedItem.pageID) {
      draggedItem.pageID = pageID;
    }
  }

  const ref = pageRefs[pageID];
  let itemStyle = {};
  // No page
  if (!ref || !ref.current) {
    itemStyle = {
      x: currentOffset.x,
      y: currentOffset.y,
    };
  } else { // In the page
    const pageGuides = guides[pageID];
    itemStyle = getItemStyles(
      initialOffset,
      currentOffset,
      pageRefs[pageID],
      pageGuides,
      draggedItem,
      zoom,
    );
  }

  const additionalitems = getAdditionalItems(
    activeElement,
    draggedItem.id,
    pages,
    acceptedItems,
  );

  const mergedItem = getMergedItem(draggedItem, acceptedItems);

  return (
    <>
      <ItemPositioner
        classNames={`reportItem${isDragging ? ' isDraggingLayerElement' : ''}`}
        style={{
          ...layerStyles(itemStyle),
          cursor: isDragging ? 'grabbing' : 'pointer',
          height: draggedItem.height,
          outlineColor: '#4277ff',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: draggedItem.width,
        }}
      >
        <ReportItemRenderer item={draggedItem}>
          {ReportItem => (
            <ReportItem
              isDragging={isDragging}
              item={mergedItem}
              itemAccessor={itemAccessor}
              zoom={zoom}
            />
          )}
        </ReportItemRenderer>
      </ItemPositioner>
      {additionalitems.map(ii => {
        const __itemStyle = {
          x: itemStyle.x - ((draggedItem.left - ii.left) * zoom),
          y: itemStyle.y - ((draggedItem.top - ii.top) * zoom),
        };
        return (
          <ItemPositioner
            key={ii.id}
            classNames={`reportItem${isDragging ? ' isDraggingLayerElement' : ''}`}
            style={{
              ...layerStyles(__itemStyle),
              cursor: isDragging ? 'grabbing' : 'pointer',
              height: ii.height,
              outlineColor: '#4277ff',
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              width: ii.width,
            }}
          >
            <ReportItemRenderer item={ii}>
              {ReportItem => (
                <ReportItem
                  isDragging={isDragging}
                  item={ii}
                  itemAccessor={itemAccessor}
                  zoom={zoom}
                />
              )}
            </ReportItemRenderer>
          </ItemPositioner>
        );
      })}
    </>
  );
};

DraggableItemLayer.propTypes = {
  guides: PropTypes.shape({}),
  itemAccessor: PropTypes.func,
  pageRefs: PropTypes.shape({}),
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

export default memo(DraggableItemLayer);
