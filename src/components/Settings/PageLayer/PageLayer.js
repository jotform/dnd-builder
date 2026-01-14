import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '../../../utils/functions';
import LayerItem from './LayerItem';
import LayerDragOverlay from './LayerDragOverlay';
import { elementIcons } from '../../../constants/elementIcons';
import { useTranslatedTexts } from '../../../utils/hooks';

const PageLayer = ({
  config = {},
  item: page = {},
  onItemChange = () => {},
}) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback(event => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(event => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const reversedItems = [...page.items].reverse();
      const oldIndex = reversedItems.findIndex(item => item.id === active.id);
      const newIndex = reversedItems.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(reversedItems, oldIndex, newIndex).map(i => i.id);
        onItemChange({
          id: page.id,
        }, { items: JSON.stringify([...newItems].reverse()) });
      }
    }
  }, [page.id, page.items, onItemChange]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const { NO_ELEMENT_IN_PAGE } = useTranslatedTexts();

  const items = useMemo(() => {
    if (!page.items || page.items.length === 0) return [];
    return [...page.items].reverse().map(item => item.id);
  }, [page.items]);

  const activeItemData = useMemo(() => {
    if (!activeId || !page.items) return null;

    const reversedItems = [...page.items].reverse();
    const activeItem = reversedItems.find(item => item.id === activeId);
    if (!activeItem) return null;

    const icon = elementIcons[activeItem.itemType]
      ? elementIcons[activeItem.itemType]
      : elementIcons.default;

    return {
      icon,
      item: activeItem,
    };
  }, [activeId, page.items]);

  return (
    page.items && page.items.length > 0 ? (
      <DndContext
        collisionDetection={closestCenter}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <ul className="jfReportSelectOption-list withDnd forPageLayer">
            {[...page.items].reverse().map((item, index) => {
              const icon = elementIcons[item.itemType]
                ? elementIcons[item.itemType]
                : elementIcons.default;
              return (
                <LayerItem
                  key={item.id}
                  icon={icon}
                  id={item.id}
                  index={index}
                  item={item}
                  onItemChange={config.updater}
                  optionKey={index}
                  setActiveElement={config.setActiveElement}
                />
              );
            })}
          </ul>
        </SortableContext>
        <LayerDragOverlay activeItemData={activeItemData} />
      </DndContext>
    ) : (
      <div className="toolSection-notifier">
        {NO_ELEMENT_IN_PAGE}
      </div>
    )
  );
};

PageLayer.propTypes = {
  config: PropTypes.shape({
    setActiveElement: PropTypes.func,
    updater: PropTypes.func,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
    isVisible: PropTypes.bool,
    itemType: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

export default PageLayer;
