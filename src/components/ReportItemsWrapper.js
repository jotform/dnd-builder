import { memo } from 'react';
import PropTypes from 'prop-types';
import ReportItemRenderer from './Builder/ReportItemRenderer';
import DraggableItem from './DraggableItem/DraggableItem';
import getMergedItem from '../utils/getMergedItem';
import { useBuilderStore } from '../contexts/BuilderContext';
import { isSelectedItem } from '../utils/functions';
import { usePropStore } from '../contexts/PropContext';

const ReportItemsWrapper = ({
  getIntersectionsFromMatches,
  handleMatches,
  items,
}) => {
  const acceptedItems = usePropStore(state => state.acceptedItems);
  const activeElement = useBuilderStore(state => state.activeElement);
  const itemAccessor = usePropStore(state => state.itemAccessor);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const onItemChange = usePropStore(state => state.onItemChange);

  return items
    .filter(item => (
      item.isVisible !== undefined
        ? item.isVisible
        : true
    ))
    .map(item => {
      const mergedItem = getMergedItem(item, acceptedItems);
      return (
        <DraggableItem
          key={item.id}
          getIntersectionsFromMatches={getIntersectionsFromMatches}
          handleMatches={handleMatches}
          item={item}
        >
          <ReportItemRenderer
            item={mergedItem}
          >
            {ReportItem => (
              <ReportItem
                isMultipleItemSelected={activeElement !== null && activeElement.length > 1}
                isSelected={isSelectedItem(item.id, activeElement)}
                item={mergedItem}
                itemAccessor={itemAccessor}
                onAnEventTrigger={onAnEventTrigger}
                onItemChange={onItemChange}
              />
            )}
          </ReportItemRenderer>
        </DraggableItem>
      );
    });
};

ReportItemsWrapper.propTypes = {
  getIntersectionsFromMatches: PropTypes.func,
  handleMatches: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

export default memo(ReportItemsWrapper);
