import { memo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../utils/icons';

const PageActionsBar = ({
  onPageDeselect = () => {},
  onPageSelectAll = () => {},
  pageCount = 0,
  selectedPagesCount = 0,
}) => {
  // const onPageDuplicateClick = () => {
  //   onPageDuplicate(page);
  //   onAnEventTrigger('duplicatePage', order + 1);
  // };

  // const onPageRemoveClick = () => {
  //   onPageRemove(page.id);
  //   onAnEventTrigger('removePageFromSlides', page.id);
  // };

  return (
    <div
      className="pageActionsBar p-absolute d-flex j-between a-center"
    >
      <div className="pageActionsBar-section">
        <span>
          {`Total ${pageCount} Slides`}
        </span>
        <button
          key="Select All"
          className="jfReportButton forPageActionsBar withRadius"
          onClick={onPageSelectAll}
          title="Select All"
          type="button"
        >
          Select All
        </button>
      </div>
      {selectedPagesCount > 0 && (
        <>
          <div className="pageActionsBar-section">
            <span className="pageSummary">{`${selectedPagesCount} Slides`}</span>
            <span> selected</span>
            <button
              key="Deselect"
              className="jfReportButton forPageActionsBar withRadius forDeselect"
              onClick={onPageDeselect}
              title="Deselect"
              type="button"
            >
              <span>
                Deselect
              </span>
              <icons.close className="jfReportSVG icon-duplicateLine" />
            </button>
          </div>
          <div className="pageActionsBar-section">
            <button
              key="Duplicate Page"
              className="jfReportButton forPageActionsBar forDuplicate"
              // onClick={onPageDuplicateClick}
              title="Duplicate Page"
              type="button"
            >
              <icons.duplicate className="jfReportSVG icon-duplicateLine" />
              <span>Duplicate</span>
            </button>
            <button
              key="Remove Slide"
              className="jfReportButton isDanger"
              // onClick={onPageRemoveClick}
              title="Remove Slide"
              type="button"
            >
              <icons.trash className="jfReportSVG icon-trashLine" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

PageActionsBar.propTypes = {
  // onAnEventTrigger: PropTypes.func,
  // onPageDuplicate: PropTypes.func,
  // onPageRemove: PropTypes.func,
  // order: PropTypes.string,
  onPageDeselect: PropTypes.func,
  onPageSelectAll: PropTypes.func,
  page: PropTypes.shape({ id: PropTypes.string }),
  pageCount: PropTypes.number,
  selectedPagesCount: PropTypes.number,
};

export default memo(PageActionsBar);
