import { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslatedTexts } from '../../utils/hooks';
import { useIcons } from '../../hooks/useIcons';

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

  const {
    duplicate: DuplicateIcon,
    lock: LockIcon,
    settings: SettingsIcon,
    trash: TrashIcon,
    unlock: UnlockIcon,
  } = useIcons();

  if (isMultipleItemSelected) return null;

  if (isLocked) {
    return (
      <div className="reportItemMenu d-flex dir-col a-center forLocked">
        <button
          className="reportItemMenu-item js-locked"
          onClick={changeLockStatus}
          type="button"
        >
          <LockIcon
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
        <SettingsIcon className="jfReportSVG icon-settings isWhite" />
      </button>
      <button
        className="reportItemMenu-item js-duplicateItem"
        onClick={duplicateItem}
        title={DUPLICATE_ITEM}
        type="button"
      >
        <DuplicateIcon className="jfReportSVG icon-duplicate isWhite" />
      </button>
      <button
        className="reportItemMenu-item js-lockItem"
        onClick={changeLockStatus}
        title={LOCK_ITEM}
        type="button"
      >
        <UnlockIcon
          className="jfReportSVG icon-lock isWhite"
        />
      </button>
      <button
        className="reportItemMenu-item js-deleteItem"
        onClick={deleteItem}
        title={DELETE_ITEM}
        type="button"
      >
        <TrashIcon className="jfReportSVG icon-trash isWhite" />
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
