import { memo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../utils/icons';

const PageThumbnailActions = ({
  onAnEventTrigger = () => {},
  onPageAdd = () => {},
  onPageDuplicate = () => {},
  onPageRemove = () => {},
  order = 0,
  page = {},
}) => {
  const onPageDuplicateClick = () => {
    onPageDuplicate(page);
    onAnEventTrigger('duplicatePage', order + 1);
  };

  const onPageRemoveClick = () => {
    onPageRemove(page.id);
    onAnEventTrigger('removePageFromSlides', page.id);
  };

  const onPageAddClick = () => {
    const newPageIndex = order + 1;
    onPageAdd(newPageIndex);
    onAnEventTrigger('addNewPageFromSlides', newPageIndex);
  };

  return (
    <div
      className="thumbnailActions d-flex j-between f-width"
      id={`pageActions-id-${order}`}
    >
      <div className="floatingController forPageAction forSlides f-width">
        <div className="floatingController-container d-flex a-center j-around dir-row">
          <button
            key="Duplicate Page"
            className="controllerItem"
            onClick={onPageDuplicateClick}
            title="Duplicate Page"
            type="button"
          >
            <icons.duplicate className="jfReportSVG icon-duplicateLine" />
          </button>
          <button
            key="Remove Slide"
            className="controllerItem isDanger"
            onClick={onPageRemoveClick}
            title="Remove Slide"
            type="button"
          >
            <icons.trash className="jfReportSVG icon-trashLine" />
          </button>
          <button
            key="Add Slide"
            className="controllerItem"
            onClick={onPageAddClick}
            title="Add Slide"
            type="button"
          >
            <icons.plus className="jfReportSVG icon-plus" />
          </button>
        </div>
      </div>
    </div>
  );
};

PageThumbnailActions.propTypes = {
  onAnEventTrigger: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageRemove: PropTypes.func,
  order: PropTypes.number,
  page: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default memo(PageThumbnailActions);
