import { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import StaticPage from '../../Preview/StaticPage';
import PageThumbnailActions from './PageThumbnailActions';

const PageItem = ({
  id,
  isSelected,
  onPageClick,
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
  }, [transform, transition, isDragging]);

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
          items={page.items}
          style={style}
        />
      </div>
      <PageThumbnailActions
        order={order}
        page={page}
      />
    </div>
  );
};

PageItem.propTypes = {
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onPageClick: PropTypes.func,
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
