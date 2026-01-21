import { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { usePropStore } from '../../../contexts/PropContext';
import { arrayMove } from '../../../utils/functions';
import AllSlidesPanelToggler from './AllSlidesPanelToggler';
import PageList from './PageList';
import PageActionsBar from './PageActionsBar';

const AllSlidesPanel = () => {
  const isAllSlidesPanelOpen = useBuilderStore(state => state.isAllSlidesPanelOpen);
  const setIsAllSlidesPanelOpen = useBuilderStore(state => state.setIsAllSlidesPanelOpen);

  const useExperimentalFeatures = usePropStore(state => state.useExperimentalFeatures);
  const onPageOrdersChange = usePropStore(state => state.onPageOrdersChange);
  const pages = usePropStore(state => state.pages);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);

  const [selectedPages, setSelectedPages] = useState([]);
  const [animationEnd, setAnimationEnd] = useState(false);

  const onPageSort = useCallback(({ newIndex, oldIndex }) => {
    const newPageOrders = arrayMove(pages, oldIndex, newIndex).reduce((acc, page, index) => {
      acc[page.id] = { order: index + 1 };
      return acc;
    }, {});
    onPageOrdersChange(newPageOrders);
    onAnEventTrigger('sortPageFromAllSlides');
  }, [pages]);

  const onPageClick = useCallback(e => {
    const pageID = e.target.getAttribute('data-id');
    if (selectedPages.indexOf(pageID) > -1) {
      setSelectedPages(selectedPages.filter(pid => pid !== pageID));
    } else {
      setSelectedPages([...selectedPages, pageID]);
    }
  }, [selectedPages]);

  const onPageSelectAll = () => {
    const getAllPageIds = pages.map(page => page.id);
    setSelectedPages(getAllPageIds);
  };

  const onPageDeselect = () => {
    setSelectedPages([]);
  };

  const onClosePanel = () => {
    setAnimationEnd(false);
    setIsAllSlidesPanelOpen(false);
  };

  const onAnimationEnd = () => {
    if (!isAllSlidesPanelOpen) {
      setAnimationEnd(true);
    }
  };

  // Panel className
  const panelAdditionalClassName = classNames(
    'forAllSlides p-absolute f-all',
    {
      isIdle: !isAllSlidesPanelOpen,
    },
    { hidden: !useExperimentalFeatures },
  );

  return (
    <Panel
      additionalClassName={panelAdditionalClassName}
      onAnimationEnd={onAnimationEnd}
    >
      <AllSlidesPanelToggler onClosePanel={onClosePanel} />
      {(isAllSlidesPanelOpen || (!isAllSlidesPanelOpen && !animationEnd)) && (
        <div className="toolItemWrapper f-height d-flex">
          <div className="toolItem-tabContent f-width">
            <PageList
              onPageClick={onPageClick}
              onSortEnd={onPageSort}
              selectedPages={selectedPages}
            />
            <PageActionsBar
              onPageDeselect={onPageDeselect}
              onPageSelectAll={onPageSelectAll}
              pageCount={pages.length}
              selectedPagesCount={selectedPages.length}
            />
          </div>
        </div>
      )}
    </Panel>
  );
};

export default memo(AllSlidesPanel);
