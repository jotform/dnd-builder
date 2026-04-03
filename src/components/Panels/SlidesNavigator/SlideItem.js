import {
  memo, useCallback, useMemo, useRef,
} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import StaticSlideItem from './StaticSlideItem';
import SlideItemMoreMenu from './MoreMenu/SlideItemMoreMenu';
import { emptyFunction } from '../../../utils/functions';
import { useBuilderStore } from '../../../contexts/BuilderContext';

const SlideItem = ({
  id,
  onPageClick,
  order,
  page,
  reportHeight,
  reportWidth,
  style,
}) => {
  const moreMenuRef = useRef(null);

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const visiblePageOrder = useBuilderStore(state => state.visiblePageOrder);
  const setVisiblePageOrder = useBuilderStore(state => state.setVisiblePageOrder);

  const itemClickHandler = useCallback(e => {
    onPageClick?.(e);
    setVisiblePageOrder(order);
  }, [order, onPageClick, setVisiblePageOrder]);

  const handleContextMenu = useCallback(e => {
    e.preventDefault();
    moreMenuRef.current?.handleOpenMenu(e);
  }, []);

  const dragStyle = useMemo(() => {
    const baseStyle = {
      opacity: isDragging ? 0.5 : 1,
      transform: CSS.Transform.toString(transform),
      transition: transition,
    };

    return { ...baseStyle, ...style };
  }, [transform, transition, isDragging, style]);

  const selected = useMemo(() => visiblePageOrder.toString() === order.toString(), [visiblePageOrder, order]);

  return (
    <div
      ref={setNodeRef}
      className={`slides-navigator-item${selected ? ' selected' : ''}`}
      data-id={page.id}
      data-order={order}
      onClick={itemClickHandler}
      onContextMenu={handleContextMenu}
      onKeyDown={emptyFunction}
      style={dragStyle}
      {...attributes}
      {...listeners}
    >
      <div className="slides-navigator-item-order">{order}</div>
      <div className="slides-navigator-item-content">
        <StaticSlideItem
          backgroundColor={page.backgroundColor}
          items={page.items}
          reportHeight={reportHeight}
          reportWidth={reportWidth}
        />
      </div>
      <SlideItemMoreMenu
        ref={moreMenuRef}
        order={order}
        page={page}
      />
    </div>
  );
};

SlideItem.propTypes = {
  id: PropTypes.string.isRequired,
  onPageClick: PropTypes.func,
  order: PropTypes.number,
  page: PropTypes.shape({
    backgroundColor: PropTypes.string,
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  reportHeight: PropTypes.number.isRequired,
  reportWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({
    opacity: PropTypes.number,
    transform: PropTypes.string,
    transition: PropTypes.string,
  }),
};

export default memo(SlideItem);
