import {
  useRef, useMemo, useCallback, forwardRef, useImperativeHandle, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Virtuoso } from 'react-virtuoso';
import memoize from 'memoize-one';
import SortablePageItemRenderer from './SortablePageItemRenderer';
import SortableDragOverlay from './SortablePageItemDragOverlay';

const createItemData = memoize((
  acceptedItems,
  additionalPageItems,
  disableInteraction,
  hashCode,
  itemAccessor,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  pageContainerStyle,
  pageGetter,
) => ({
  acceptedItems,
  additionalPageItems,
  disableInteraction,
  hashCode,
  itemAccessor,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  pageContainerStyle,
  pageGetter,
}));

const SortablePageList = () => {
  const VirtuosoList = forwardRef(({
    acceptedItems = {},
    additionalPageItems = [],
    disableInteraction = [],
    hashCode = '',
    height,
    itemAccessor = () => {},
    onAnEventTrigger = () => {},
    onPageAdd = () => {},
    onPageClick = () => {},
    onPageDuplicate = () => {},
    onPageRemove = () => {},
    onSortEnd = () => {},
    pageContainerStyle = {},
    pageCount = 0,
    pageGetter = () => {},
    pages = [],
    width,
  }, ref) => {
    const sortablePageListRef = useRef(null);
    const virtuosoRef = useRef(null);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 0,
        },
      }),
      useSensor(KeyboardSensor),
    );

    const itemData = useMemo(() => createItemData(
      acceptedItems,
      additionalPageItems,
      disableInteraction,
      hashCode,
      itemAccessor,
      onAnEventTrigger,
      onPageAdd,
      onPageClick,
      onPageDuplicate,
      onPageRemove,
      pageContainerStyle,
      pageGetter,
    ), [
      acceptedItems,
      additionalPageItems,
      disableInteraction,
      hashCode,
      itemAccessor,
      onAnEventTrigger,
      onPageAdd,
      onPageClick,
      onPageDuplicate,
      onPageRemove,
      pageContainerStyle,
      pageGetter,
    ]);

    const scrollToIndex = useCallback((index, align = 'center') => {
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({ align, index });
      }
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToIndex,
      sortablePageListRef: sortablePageListRef.current,
      virtuosoRef: virtuosoRef.current,
    }), [scrollToIndex]);

    const handleDragStart = useCallback(event => {
      setActiveId(event.active.id);
    }, []);

    const handleDragEnd = useCallback(event => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = parseInt(active.id, 10);
        const newIndex = parseInt(over.id, 10);

        onSortEnd({ newIndex, oldIndex });
      }
    }, [onSortEnd]);

    const handleDragCancel = useCallback(() => {
      setActiveId(null);
    }, []);

    const virtuosoStyle = useMemo(() => ({
      height: `${pageCount * 127}px`,
      scrollbarWidth: 'none',
      width: '100%',
    }), [pageCount]);

    const items = useMemo(() => pages.map((page, index) => index.toString()), [pages]);

    const activePageData = useMemo(() => {
      if (!activeId) return null;
      const activeIndex = parseInt(activeId, 10);
      const activePage = pageGetter(activeIndex);
      if (!activePage) return null;

      return {
        page: activePage,
        pageContainerLastStyle: {
          ...pageContainerStyle,
          ...activePage.backgroundColor ? { backgroundColor: activePage.backgroundColor } : {},
        },
      };
    }, [activeId, pageGetter, pageContainerStyle]);

    return (
      <div
        ref={sortablePageListRef}
        style={{ height, width }}
      >
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
              fixedItemHeight={127}
              itemContent={index => {
                const page = pageGetter(index);
                if (!page) return null;
                return (
                  <SortablePageItemRenderer
                    data={itemData}
                    id={index.toString()}
                    index={index}
                    style={{ height: 127 }}
                  />
                );
              }}
              style={virtuosoStyle}
              totalCount={pageCount}
            />
          </SortableContext>
          <SortableDragOverlay
            acceptedItems={acceptedItems}
            activePageData={activePageData}
            additionalPageItems={additionalPageItems}
            hashCode={hashCode}
            itemAccessor={itemAccessor}
          />
        </DndContext>
      </div>
    );
  });

  VirtuosoList.displayName = 'VirtuosoList';

  VirtuosoList.propTypes = {
    acceptedItems: PropTypes.shape({}),
    additionalPageItems: PropTypes.arrayOf(PropTypes.node),
    disableInteraction: PropTypes.arrayOf(PropTypes.string),
    hashCode: PropTypes.string,
    height: PropTypes.number,
    itemAccessor: PropTypes.func,
    onAnEventTrigger: PropTypes.func,
    onPageAdd: PropTypes.func,
    onPageClick: PropTypes.func,
    onPageDuplicate: PropTypes.func,
    onPageRemove: PropTypes.func,
    onSortEnd: PropTypes.func,
    pageContainerStyle: PropTypes.shape({}),
    pageCount: PropTypes.number,
    pageGetter: PropTypes.func,
    pages: PropTypes.arrayOf(PropTypes.shape({})),
    width: PropTypes.number,
  };

  return VirtuosoList;
};

export default memoize(SortablePageList);
