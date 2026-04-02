import {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Virtuoso } from 'react-virtuoso';
import { usePropStore } from '../../../contexts/PropContext';
import { arrayMove, scrollToTarget } from '../../../utils/functions';
import SlideItem from './SlideItem';
import SlideItemDragOverlay from './SlideItemDragOverlay';

const ITEM_HEIGHT = 90.5;

const SlideItemsList = () => {
  const pages = usePropStore(state => state.pages);
  const settings = usePropStore(state => state.settings);
  const onPageOrdersChange = usePropStore(state => state.onPageOrdersChange);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);

  const virtuosoRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const {
    reportLayoutHeight = 794,
    reportLayoutWidth = 1123,
  } = settings;

  const reportWidth = parseInt(reportLayoutWidth, 10);
  const reportHeight = parseInt(reportLayoutHeight, 10);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 200, distance: 0 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const items = useMemo(() => pages.map((_, index) => index.toString()), [pages]);

  const onPageClick = useCallback(e => {
    const order = e.currentTarget.getAttribute('data-order');
    if (order) {
      scrollToTarget(`pageActions-id-${order}`);
    }
  }, []);

  const handleDragStart = useCallback(event => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(event => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id, 10);
      const newIndex = parseInt(over.id, 10);
      const newPageOrders = arrayMove(pages, oldIndex, newIndex).reduce((acc, page, index) => {
        acc[page.id] = { order: index + 1 };
        return acc;
      }, {});

      onPageOrdersChange(newPageOrders);
      onAnEventTrigger('sortPageFromSlides');
    }
  }, [pages, onPageOrdersChange, onAnEventTrigger]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activePageData = useMemo(() => {
    if (!activeId) return null;
    const activeIndex = parseInt(activeId, 10);
    const page = pages[activeIndex];
    if (!page) return null;

    return { page, reportHeight, reportWidth };
  }, [activeId, pages, reportWidth, reportHeight]);

  const virtuosoStyle = useMemo(() => ({
    height: '100%',
    scrollbarWidth: 'none',
    width: '100%',
  }), []);

  return (
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
        <Virtuoso
          ref={virtuosoRef}
          className="slides-navigator-item-list"
          fixedItemHeight={ITEM_HEIGHT}
          itemContent={index => {
            const page = pages[index];
            if (!page) return null;

            return (
              <SlideItem
                id={index.toString()}
                onPageClick={onPageClick}
                order={page.order}
                page={page}
                reportHeight={reportHeight}
                reportWidth={reportWidth}
                style={{ height: ITEM_HEIGHT }}
              />
            );
          }}
          style={virtuosoStyle}
          totalCount={pages.length}
        />
      </SortableContext>

      <SlideItemDragOverlay activePageData={activePageData} />
    </DndContext>
  );
};

export default SlideItemsList;
