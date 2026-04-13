import {
  memo, useCallback, useMemo, useRef,
} from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import StaticSlideItem from './StaticSlideItem';
import SlideItemMoreMenu from './MoreMenu/SlideItemMoreMenu';
import { emptyFunction } from '../../../utils/functions';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { usePropStore } from '../../../contexts/PropContext';

const slideRevealTransition = {
  duration: 0.25,
  ease: [0.2, 0, 0.2, 1],
};

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
  const setVisiblePageOrder = useBuilderStore(state => state.setVisiblePageOrder);
  const visiblePageOrder = useBuilderStore(state => state.visiblePageOrder);
  const reportBackgroundColor = usePropStore(state => state.settings?.reportBackgroundColor);
  const selected = visiblePageOrder === order;

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const itemClickHandler = useCallback(e => {
    setVisiblePageOrder(order);
    onPageClick?.(e);
  }, [onPageClick, setVisiblePageOrder, order]);

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
      <motion.div
        className="slides-navigator-item-motion"
        initial={{ opacity: 0.25, scale: 0.95 }}
        transition={slideRevealTransition}
        viewport={{ amount: 0.2, once: true }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div className="slides-navigator-item-order">{order}</div>
        <div
          className="slides-navigator-item-content"
        >
          <StaticSlideItem
            backgroundColor={page.backgroundColor || reportBackgroundColor || '#fff'}
            items={page.items}
            reportHeight={reportHeight}
            reportWidth={reportWidth}
          />
        </div>
        <SlideItemMoreMenu
          ref={moreMenuRef}
          order={order}
          page={page}
          selected={selected}
        />
      </motion.div>
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

function slideItemPropsAreEqual(prevProps, nextProps) {
  return prevProps.id === nextProps.id
    && prevProps.order === nextProps.order
    && prevProps.page === nextProps.page
    && prevProps.reportHeight === nextProps.reportHeight
    && prevProps.reportWidth === nextProps.reportWidth
    && prevProps.style === nextProps.style
    && prevProps.onPageClick === nextProps.onPageClick;
}

export default memo(SlideItem, slideItemPropsAreEqual);
