import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const PageThumbnailActions = ({
  disableInteraction,
  onAnEventTrigger,
  onPageAdd,
  onPageDuplicate,
  onPageRemove,
  order,
  page,
}) => {
  const nextPageIndex = order + 1;

  const onPageDuplicateClick = () => {
    onPageDuplicate(page);
    onAnEventTrigger('duplicatePage', nextPageIndex);
  };

  const onPageRemoveClick = () => {
    onPageRemove(page.id);
    onAnEventTrigger('removePageFromSlides', page.id);
  };

  const onPageAddClick = () => {
    onPageAdd(nextPageIndex);
    onAnEventTrigger('addNewPageFromSlides', nextPageIndex);
  };

  const { ADD_NEW_PAGE, DUPLICATE_PAGE, REMOVE_PAGE } = useTranslatedTexts();
  return (
    <div
      className="thumbnailActions d-flex dir-col f-height j-center"
      id={`pageActions-id-${order}`}
    >
      <div className="floatingController forPageAction forSlides">
        <div className="floatingController-container">
          <button
            key="Duplicate Page"
            className="controllerItem"
            data-order={nextPageIndex}
            disabled={disableInteraction.indexOf('duplicate') > -1}
            onClick={onPageDuplicateClick}
            title={DUPLICATE_PAGE}
            type="button"
          >
            <icons.duplicate className="jfReportSVG icon-duplicateLine" />
          </button>
          <button
            key="Remove Page"
            className="controllerItem isDanger"
            data-order={order}
            disabled={disableInteraction.indexOf('remove') > -1}
            onClick={onPageRemoveClick}
            title={REMOVE_PAGE}
            type="button"
          >
            <icons.trash className="jfReportSVG icon-trashLine" />
          </button>
          <button
            key="Add New Page"
            className="controllerItem"
            data-order={nextPageIndex}
            disabled={disableInteraction.indexOf('add') > -1}
            onClick={onPageAddClick}
            title={ADD_NEW_PAGE}
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
  disableInteraction: PropTypes.arrayOf(PropTypes.string),
  onAnEventTrigger: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageRemove: PropTypes.func,
  order: PropTypes.number,
  page: PropTypes.shape({
    id: PropTypes.string,
  }),
};

PageThumbnailActions.defaultProps = {
  disableInteraction: [],
  onAnEventTrigger: () => {},
  onPageAdd: () => {},
  onPageDuplicate: () => {},
  onPageRemove: () => {},
  order: 0,
  page: {},
};

export default memo(PageThumbnailActions);
