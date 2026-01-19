import { memo } from 'react';
import ReportItemRenderer from './Builder/ReportItemRenderer';
import DraggableItem from './DraggableItem/DraggableItem';
import getMergedItem from '../utils/getMergedItem';
import { useBuilderStore } from '../contexts/BuilderContext';
import { isSelected } from '../utils/functions';

const ReportItemsWrapper = ({
  acceptedItems,
  guides,
  hashCode,
  isResize,
  itemAccessor,
  items,
  matches,
  onAnEventTrigger,
  onItemAdd,
  onItemChange,
  onItemRemove,
  onItemResize,
  setIsResize,
  setMatches,
}) => {
  const activeElement = useBuilderStore(state => state.activeElement);

  return items
    .filter(item => (
      item.isVisible !== undefined
        ? item.isVisible
        : true
    ))
    .map((item, index) => {
      const mergedItem = getMergedItem(item, acceptedItems);
      return (
        <DraggableItem
          key={item.id}
          guides={guides}
          hashCode={hashCode}
          index={index}
          isMultipleItemSelected={activeElement !== null && activeElement.length > 1}
          isResize={isResize}
          isSelected={isSelected(item.id, activeElement)}
          item={item}
          matches={matches}
          onAnEventTrigger={onAnEventTrigger}
          onItemAdd={onItemAdd}
          onItemChange={onItemChange}
          onItemRemove={onItemRemove}
          onItemResize={onItemResize}
          setIsResize={setIsResize}
          setMatches={setMatches}
        >
          <ReportItemRenderer
            key={item.id}
            item={mergedItem}
          >
            {ReportItem => (
              <ReportItem
                isMultipleItemSelected={activeElement !== null && activeElement.length > 1}
                isSelected={isSelected(item.id, activeElement)}
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

export default memo(ReportItemsWrapper);
