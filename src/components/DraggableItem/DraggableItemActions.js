import { memo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';
import { useTranslatedTexts } from '../../utils/hooks';

const DraggableItemActions = ({
  changeLockStatus = () => {},
  deleteItem = () => {},
  duplicateItem = () => {},
  isLocked = false,
  isMultipleItemSelected = false,
  openSettings = () => {},
}) => {
  const {
    DELETE_ITEM,
    DUPLICATE_ITEM,
    ITEM_SETTINGS,
    LOCK_ITEM,
  } = useTranslatedTexts();

  if (isMultipleItemSelected) return null;

  if (isLocked) {
    return (
      <div className="reportItemMenu d-flex dir-col a-center forLocked">
        <button
          className="reportItemMenu-item js-locked"
          onClick={changeLockStatus}
          type="button"
        >
          <icons.lock
            className="jfReportSVG icon-lock isWhite"
          />
        </button>
      </div>
    );
  }
  return (
    <div className="reportItemMenu d-flex dir-col a-center">
      <button
        className="reportItemMenu-item js-itemSettings"
        onClick={openSettings}
        title={ITEM_SETTINGS}
        type="button"
      >
        <icons.settings className="jfReportSVG icon-settings isWhite" />
      </button>
      <button
        className="reportItemMenu-item js-duplicateItem"
        onClick={duplicateItem}
        title={DUPLICATE_ITEM}
        type="button"
      >
        <icons.duplicate className="jfReportSVG icon-duplicate isWhite" />
      </button>
      <button
        className="reportItemMenu-item js-lockItem"
        onClick={changeLockStatus}
        title={LOCK_ITEM}
        type="button"
      >
        <icons.unlock
          className="jfReportSVG icon-lock isWhite"
        />
      </button>
      <button
        className="reportItemMenu-item js-deleteItem"
        onClick={deleteItem}
        title={DELETE_ITEM}
        type="button"
      >
        <icons.trash className="jfReportSVG icon-trash isWhite" />
      </button>
    </div>
  );
};

DraggableItemActions.propTypes = {
  changeLockStatus: PropTypes.func,
  deleteItem: PropTypes.func,
  duplicateItem: PropTypes.func,
  isLocked: PropTypes.bool,
  isMultipleItemSelected: PropTypes.bool,
  openSettings: PropTypes.func,
};

export default memo(DraggableItemActions);
