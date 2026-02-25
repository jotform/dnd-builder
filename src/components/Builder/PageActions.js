import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';
import { moveItemInArrayFromIndexToIndex, scrollToTarget } from '../../utils/functions';
import { useTranslatedTexts } from '../../utils/hooks';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';

const PageActions = ({
  order = 0,
  pageID = '',
}) => {
  const pages = usePropStore(state => state.pages);
  const pageCount = pages.length;
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const onPageAdd = usePropStore(state => state.onPageAdd);
  const onPageDuplicate = usePropStore(state => state.onPageDuplicate);
  const onPageOrdersChange = usePropStore(state => state.onPageOrdersChange);
  const onPageRemove = usePropStore(state => state.onPageRemove);
  const disableInteraction = usePropStore(state => state.disableInteraction);

  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const setEditedElement = useBuilderStore(state => state.setEditedElement);

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
      <div className="floatingController page-toolbar">
        <div className="floatingController-container">
          <button
            key="Slide Settings"
            className="controllerItem"
            onClick={pageSettings}
            title={PAGE_SETTINGS}
            type="button"
          >
            <icons.pageSettings className="toolbar-icon" />
          </button>
          <button
            key="Duplicate Page"
            className="controllerItem"
            disabled={disableInteraction.indexOf('duplicate') > -1}
            onClick={onPageDuplicateClick}
            title={DUPLICATE_PAGE}
            type="button"
          >
            <icons.duplicate className="toolbar-icon" />
          </button>
          <button
            key="Remove Slide"
            className="controllerItem error"
            disabled={disableInteraction.indexOf('remove') > -1}
            onClick={onPageRemoveClick}
            title={REMOVE_PAGE}
            type="button"
          >
            <icons.trash className="toolbar-icon" />
          </button>
        </div>
        <div className="floatingController-container">
          <button
            key="Move Page Upwards"
            className={`controllerItem${order === 1 ? ' disabled' : ''}`}
            onClick={changeOrder(-1)}
            title={MOVE_PAGE_UPWARDS}
            type="button"
          >
            <icons.angleUp className="toolbar-icon" />
          </button>
          <button
            key="Move Page Downwards"
            className={`controllerItem${order === pageCount ? ' disabled' : ''}`}
            onClick={changeOrder(1)}
            title={MOVE_PAGE_DOWNWARDS}
            type="button"
          >
            <icons.angleDown className="toolbar-icon" />
          </button>
        </div>
        <div className="floatingController-container">
          <button
            key="Add Slide"
            className="controllerItem primary"
            disabled={disableInteraction.indexOf('add') > -1}
            onClick={onPageAddClick}
            title={ADD_NEW_PAGE}
            type="button"
          >
            <icons.plus className="toolbar-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

PageActions.propTypes = {
  order: PropTypes.number,
  pageID: PropTypes.string,
};

export default PageActions;
