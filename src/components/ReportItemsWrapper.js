import { memo } from 'react';
import ReportItemRenderer from './Builder/ReportItemRenderer';
import DraggableItem from './DraggableItem/DraggableItem';
import getMergedItem from '../utils/getMergedItem';
import { useBuilderStore } from '../contexts/BuilderContext';
import { isSelected } from '../utils/functions';
import { usePropStore } from '../contexts/PropContext';

const ReportItemsWrapper = ({
  guides,
  isResize,
  items,
  matches,
  setIsResize,
  setMatches,
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
    .map((item, index) => {
      const mergedItem = getMergedItem(item, acceptedItems);
      return (
        <DraggableItem
          key={item.id}
          guides={guides}
          index={index}
          isMultipleItemSelected={activeElement !== null && activeElement.length > 1}
          isResize={isResize}
          isSelected={isSelected(item.id, activeElement)}
          item={item}
          matches={matches}
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
