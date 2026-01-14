import {
  memo, useRef, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import PageItem from './PageItem';
import PageItemDragOverlay from './PageItemDragOverlay';
import { getScaleForPageThumbnailLarge } from '../../../utils/functions';
import PageAdder from '../../Builder/PageAdder';

const PageList = ({
  acceptedItems,
  additionalPageItems,
  hashCode,
  itemAccessor,
  layoutSettings,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  onSortEnd,
  pages,
  selectedPages,
}) => {
  const [activeId, setActiveId] = useState(null);
  const pageContainerStyles = useRef({});
  const {
    reportBackgroundColor,
    reportLayoutHeight = 794,
    reportLayoutWidth = 1123,
  } = layoutSettings;
  const width = parseInt(reportLayoutWidth, 10);
  const height = parseInt(reportLayoutHeight, 10);
  const scale = getScaleForPageThumbnailLarge(width, height);

  pageContainerStyles.current = {
    height: height,
    transform: `scale(${scale})`,
    transformOrigin: '0 0',
    width: width,
  };

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
      const oldIndex = pages.findIndex(page => page.id === active.id);
      const newIndex = pages.findIndex(page => page.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onSortEnd({ newIndex, oldIndex });
      }
    }
  }, [pages, onSortEnd]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const items = useMemo(() => {
    if (!pages || pages.length === 0) return [];
    return pages.map(page => page.id);
  }, [pages]);

  const activePageData = useMemo(() => {
    if (!activeId || !pages) return null;

    const activePage = pages.find(page => page.id === activeId);
    if (!activePage) return null;

    const { backgroundColor } = activePage;
    const pageContainerLastStyle = {
      ...pageContainerStyles.current,
      backgroundColor: backgroundColor ? backgroundColor : reportBackgroundColor || '#fff',
    };

    return {
      page: activePage,
      pageContainerLastStyle,
    };
  }, [activeId, pages, reportBackgroundColor]);

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
        strategy={rectSortingStrategy}
      >
        <ul className="jfReport-pageThumbnailList d-flex j-between f-wrap">
          {pages.map(page => {
            const { backgroundColor } = page;
            const style = {
              ...pageContainerStyles.current,
              backgroundColor: backgroundColor ? backgroundColor : reportBackgroundColor || '#fff',
            };
            return (
              <PageItem
                key={`item-${page.id}-${page.order}`}
                acceptedItems={acceptedItems}
                additionalPageItems={additionalPageItems}
                hashCode={hashCode}
                id={page.id}
                index={page.order - 1}
                isSelected={selectedPages.indexOf(page.id) > -1}
                itemAccessor={itemAccessor}
                onAnEventTrigger={onAnEventTrigger}
                onPageAdd={onPageAdd}
                onPageClick={onPageClick}
                onPageDuplicate={onPageDuplicate}
                onPageRemove={onPageRemove}
                order={page.order}
                page={page}
                style={style}
              />
            );
          })}
          <div className="thumbnailWrapper forPageAdder d-flex j-end dir-col">
            <PageAdder
              onPageAdd={onPageAdd}
              pageCount={pages.length}
            />
          </div>
          <div className="spacer" />
          <div className="spacer" />
          <div className="spacer" />
        </ul>
      </SortableContext>
      <PageItemDragOverlay
        acceptedItems={acceptedItems}
        activePageData={activePageData}
        additionalPageItems={additionalPageItems}
        hashCode={hashCode}
        itemAccessor={itemAccessor}
      />
    </DndContext>
  );
};

PageList.propTypes = {
  acceptedItems: PropTypes.shape({}),
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  layoutSettings: PropTypes.shape({
    reportBackgroundColor: PropTypes.string,
    reportLayoutHeight: PropTypes.string,
    reportLayoutWidth: PropTypes.string,
  }),
  onAnEventTrigger: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageClick: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageRemove: PropTypes.func,
  onSortEnd: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  selectedPages: PropTypes.arrayOf(PropTypes.string),
};

export default memo(PageList);
