import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import StaticSlideItem from './StaticSlideItem';

const dropAnimation = {
  duration: 150,
  easing: 'ease-out',
  sideEffects: defaultDropAnimationSideEffects({
    styles: { dragOverlay: { opacity: '0', transform: 'rotate(10deg) scale(1.2)' } },
  }),
};

const SlideItemDragOverlay = ({ activePageData }) => {
  return (
    <DragOverlay
      adjustScale={false}
      dropAnimation={dropAnimation}
      style={{ cursor: 'grabbing' }}
    >
      {activePageData ? (
        <div
          className="slides-navigator-item"
          style={{ opacity: 0.5 }}
        >
          <div className="slides-navigator-item-order">{activePageData.page.order}</div>
          <div className="slides-navigator-item-content">
            <StaticSlideItem
              backgroundColor={activePageData.page.backgroundColor}
              items={activePageData.page.items}
              reportHeight={activePageData.reportHeight}
              reportWidth={activePageData.reportWidth}
            />
          </div>
        </div>
      ) : null}
    </DragOverlay>
  );
};

SlideItemDragOverlay.propTypes = {
  activePageData: PropTypes.shape({
    page: PropTypes.shape({
      backgroundColor: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.shape({})),
      order: PropTypes.number,
    }),
    reportHeight: PropTypes.number,
    reportWidth: PropTypes.number,
  }),
};

export default SlideItemDragOverlay;
