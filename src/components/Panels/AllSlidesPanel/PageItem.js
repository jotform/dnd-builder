import { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import StaticPage from '../../Preview/StaticPage';
import PageThumbnailActions from './PageThumbnailActions';

const PageItem = ({
  acceptedItems,
  additionalPageItems,
  hashCode,
  id,
  isSelected,
  itemAccessor,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  order,
  page,
  style,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const dragStyle = useMemo(() => {
    const opacity = isDragging ? 0.5 : 1;
    const transitionValue = isDragging ? 'none' : transition;
    return {
      opacity,
      transform: CSS.Transform.toString(transform),
      transition: transitionValue,
    };
  }, [transform, transition, isDragging, style]);

  const onKeyDown = f => f;
  return (
    <div
      ref={setNodeRef}
      className={(
        classNames('thumbnailWrapper d-flex dir-col a-center j-center p-relative', { isSelected })
      )}
      data-id={page.id}
      data-order={order}
      onClick={onPageClick}
      onKeyDown={onKeyDown}
      style={dragStyle}
      {...attributes}
      {...listeners}
    >
      <div className="thumbnailOrder">{order}</div>
      <div className="thumbnailFrame o-hidden">
        <StaticPage
          acceptedItems={acceptedItems}
          additionalPageItems={additionalPageItems}
          hashCode={hashCode}
          itemAccessor={itemAccessor}
          items={page.items}
          style={style}
        />
      </div>
      <PageThumbnailActions
        onAnEventTrigger={onAnEventTrigger}
        onPageAdd={onPageAdd}
        onPageDuplicate={onPageDuplicate}
        onPageRemove={onPageRemove}
        order={order}
        page={page}
      />
    </div>
  );
};

PageItem.propTypes = {
  acceptedItems: PropTypes.shape({}),
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  itemAccessor: PropTypes.func,
  onAnEventTrigger: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageClick: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageRemove: PropTypes.func,
  order: PropTypes.number,
  page: PropTypes.shape({
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  style: PropTypes.shape({
    opacity: PropTypes.number,
    transform: PropTypes.string,
    transition: PropTypes.string,
  }),
};

export default memo(PageItem);
