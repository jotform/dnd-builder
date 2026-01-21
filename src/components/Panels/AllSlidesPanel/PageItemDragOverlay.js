import { DragOverlay } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import StaticPage from '../../Preview/StaticPage';

const PageItemDragOverlay = ({
  activePageData,
}) => {
  return (
    <DragOverlay
      adjustScale={false}
      dropAnimation={null}
      style={{ cursor: 'grabbing' }}
    >
      {activePageData ? (
        <div
          // eslint-disable-next-line max-len
          className="thumbnailWrapper d-flex dir-col a-center j-center p-relative pageThumbnailHelper forAllSlides"
          style={{ opacity: 0.5 }}
        >
          <div className="thumbnailOrder">{activePageData.page.order}</div>
          <div className="thumbnailFrame o-hidden">
            <StaticPage
              isThumbnail
              items={activePageData.page.items}
              style={activePageData.pageContainerLastStyle}
            />
          </div>
          <div className="thumbnailActions d-flex dir-col f-height j-center" />
        </div>
      ) : null}
    </DragOverlay>
  );
};

PageItemDragOverlay.propTypes = {
  activePageData: PropTypes.shape({
    page: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({})),
      order: PropTypes.number,
    }),
    pageContainerLastStyle: PropTypes.shape({}),
  }),
};

export default PageItemDragOverlay;
