import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';
import { moveItemInArrayFromIndexToIndex, scrollToTarget } from '../../utils/functions';
import { useTranslatedTexts } from '../../utils/hooks';

const PageActions = ({
  disableInteraction,
  onAnEventTrigger,
  onPageAdd,
  onPageDuplicate,
  onPageOrdersChange,
  onPageRemove,
  order,
  pageCount,
  pageID,
  pages,
  setEditedElement,
  setIsRightPanelOpen,
}) => {
  const pageSettings = () => {
    setEditedElement(`p_${pageID}`);
    setIsRightPanelOpen(true);
  };

  const onPageAddClick = () => {
    const newPageIndex = order + 1;
    onPageAdd(newPageIndex);
    scrollToTarget(`pageActions-id-${newPageIndex}`, 350);
    onAnEventTrigger('addNewPage', newPageIndex);
  };

  const onPageRemoveClick = () => {
    onPageRemove(pageID);
    onAnEventTrigger('removePage', pageID);
  };

  const changeOrder = direction => {
    return () => {
      const pageIndex = pages.findIndex(page => page.id === pageID);
      const editedPages = moveItemInArrayFromIndexToIndex(
        pages,
        pageIndex,
        pageIndex + direction,
      );
      const pageOrders = editedPages.reduce((acc, page, index) => {
        const newOrder = index + 1;
        acc[page.id] = {
          order: newOrder,
        };
        return acc;
      }, {});
      onPageOrdersChange(pageOrders);
      scrollToTarget(`pageActions-id-${order + direction}`);
      onAnEventTrigger('changePageOrder', direction);
    };
  };

  const onPageDuplicateClick = () => {
    const foundPage = pages.find(page => page.id === pageID);
    onPageDuplicate(foundPage);
    scrollToTarget(`pageActions-id-${order + 1}`, 350);
    onAnEventTrigger('duplicatePage', order + 1);
  };

  const {
    ADD_NEW_PAGE, DUPLICATE_PAGE, MOVE_PAGE_DOWNWARDS,
    MOVE_PAGE_UPWARDS, PAGE_SETTINGS, REMOVE_PAGE,
  } = useTranslatedTexts();
  return (
    <div
      className="jfReport-pageInfo d-flex j-center"
      id={`pageActions-id-${order}`}
    >
      <div className="pageCounter p-relative d-flex">
        {`${order}`}
      </div>
      <div className="floatingController forPageAction">
        <div className="floatingController-container hasGroup">
          <button
            key="Slide Settings"
            className="controllerItem pageSettingSideBtn js-pageSetting"
            onClick={pageSettings}
            title={PAGE_SETTINGS}
            type="button"
          >
            <icons.pageSettings className="jfReportSVG icon-pageSettings" />
          </button>
          <button
            key="Duplicate Page"
            className="controllerItem js-duplicatePage"
            disabled={disableInteraction.indexOf('duplicate') > -1}
            onClick={onPageDuplicateClick}
            title={DUPLICATE_PAGE}
            type="button"
          >
            <icons.duplicate className="jfReportSVG icon-duplicateLine" />
          </button>
          <button
            key="Remove Slide"
            className="controllerItem isDanger js-removePage"
            disabled={disableInteraction.indexOf('remove') > -1}
            onClick={onPageRemoveClick}
            title={REMOVE_PAGE}
            type="button"
          >
            <icons.trash className="jfReportSVG icon-trashLine" />
          </button>
        </div>
        <div className="floatingController-container hasGroup">
          <button
            key="Move Page Upwards"
            className={`js-changeOrderUp controllerItem${order === 1 ? ' disabled' : ''}`}
            onClick={changeOrder(-1)}
            title={MOVE_PAGE_UPWARDS}
            type="button"
          >
            <icons.arrowUp className="jfReportSVG icon-arrow isTick" />
          </button>
          <button
            key="Move Page Downwards"
            className={`js-changeOrderDown controllerItem${order === pageCount ? ' disabled' : ''}`}
            onClick={changeOrder(1)}
            title={MOVE_PAGE_DOWNWARDS}
            type="button"
          >
            <icons.arrowDown className="jfReportSVG icon-arrow isTick" />
          </button>
        </div>
        <div className="floatingController-container">
          <button
            key="Add Slide"
            className="js-addNewPage controllerItem"
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

PageActions.propTypes = {
  disableInteraction: PropTypes.arrayOf(PropTypes.string),
  onAnEventTrigger: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageOrdersChange: PropTypes.func,
  onPageRemove: PropTypes.func,
  order: PropTypes.number,
  pageCount: PropTypes.number,
  pageID: PropTypes.string,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  setEditedElement: PropTypes.func,
  setIsRightPanelOpen: PropTypes.func,
};

PageActions.defaultProps = {
  disableInteraction: [],
  onAnEventTrigger: () => {},
  onPageAdd: () => {},
  onPageDuplicate: () => {},
  onPageOrdersChange: () => {},
  onPageRemove: () => {},
  order: 0,
  pageCount: 1,
  pageID: '',
  pages: [],
  setEditedElement: () => {},
  setIsRightPanelOpen: () => {},
};

export default PageActions;
