import { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import StaticPage from '../../Preview/StaticPage';
import PageThumbnailActions from './PageThumbnailActions';
import { emptyFunction } from '../../../utils/functions';

const SortablePageItem = ({
  id,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  order,
  page,
  pageContainerStyle,
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
    const baseStyle = {
      opacity: isDragging ? 0.5 : 1,
      transform: CSS.Transform.toString(transform),
      transition: transition,
    };

    return { ...baseStyle, ...style };
  }, [transform, transition, isDragging, style]);

  return (
    <div
      ref={setNodeRef}
      className="thumbnailWrapper d-flex a-center j-between"
      data-id={page.id}
      data-order={order}
      onClick={onPageClick}
      onKeyDown={emptyFunction}
      style={dragStyle}
      {...attributes}
      {...listeners}
    >
      <div className="thumbnailOrder">{order}</div>
      <div className="thumbnailFrame o-hidden">
        <StaticPage
          isThumbnail
          items={page.items}
          style={pageContainerStyle}
        />
      </div>
      <PageThumbnailActions
        onPageAdd={onPageAdd}
        onPageDuplicate={onPageDuplicate}
        onPageRemove={onPageRemove}
        order={order}
        page={page}
      />
    </div>
  );
};

SortablePageItem.propTypes = {
  id: PropTypes.string.isRequired,
  onPageAdd: PropTypes.func,
  onPageClick: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageRemove: PropTypes.func,
  order: PropTypes.number,
  page: PropTypes.shape({
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  pageContainerStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  style: PropTypes.shape({
    opacity: PropTypes.number,
    transform: PropTypes.string,
    transition: PropTypes.string,
  }),
};

export default memo(SortablePageItem);
