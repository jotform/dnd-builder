import { memo } from 'react';
import ReportItemRenderer from './Builder/ReportItemRenderer';
import DraggableItem from './DraggableItem/DraggableItem';
import getMergedItem from '../utils/getMergedItem';

const isSelected = (id, activeElements) => {
  if (activeElements === null) return id === activeElements;
  return activeElements.indexOf(id) !== -1;
};

const ReportItemsWrapper = ({
  acceptedItems,
  activeElement,
  guides,
  hashCode,
  isResize,
  isRightPanelOpen,
  isTextEditorOpen,
  itemAccessor,
  items,
  matches,
  onAnEventTrigger,
  onItemAdd,
  onItemChange,
  onItemRemove,
  onItemResize,
  setActiveElement,
  setContextMenuProps,
  setIsResize,
  setIsRightPanelOpen,
  setMatches,
  zoom,
}) => {
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
          isRightPanelOpen={isRightPanelOpen}
          isSelected={isSelected(item.id, activeElement)}
          isTextEditorOpen={isTextEditorOpen}
          item={item}
          matches={matches}
          onAnEventTrigger={onAnEventTrigger}
          onItemAdd={onItemAdd}
          onItemChange={onItemChange}
          onItemRemove={onItemRemove}
          onItemResize={onItemResize}
          setActiveElement={setActiveElement}
          setContextMenuProps={setContextMenuProps}
          setIsResize={setIsResize}
          setIsRightPanelOpen={setIsRightPanelOpen}
          setMatches={setMatches}
          zoom={zoom}
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
