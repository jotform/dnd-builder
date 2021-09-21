import { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import { useBuilderContext } from '../../../utils/builderContext';
import { usePropContext } from '../../../utils/propContext';
import { arrayMove } from '../../../utils/functions';
import AllSlidesPanelToggler from './AllSlidesPanelToggler';
import PageList from './PageList';
import PageActionsBar from './PageActionsBar';

const AllSlidesPanel = ({
  additionalPageItems,
  hashCode,
  itemAccessor,
  onPageAdd,
  onPageDuplicate,
  onPageOrdersChange,
  onPageRemove,
  pages,
}) => {
  const {
    isAllSlidesPanelOpen,
    setIsAllSlidesPanelOpen,
  } = useBuilderContext();
  const {
    acceptedItems,
    onAnEventTrigger,
    settings: layoutSettings,
    useExperimentalFeatures,
  } = usePropContext();
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
              acceptedItems={acceptedItems}
              additionalPageItems={additionalPageItems}
              axis="xy"
              distance={50}
              hashCode={hashCode}
              helperClass="pageThumbnailHelper forAllSlides"
              itemAccessor={itemAccessor}
              layoutSettings={layoutSettings}
              onAnEventTrigger={onAnEventTrigger}
              onPageAdd={onPageAdd}
              onPageClick={onPageClick}
              onPageDuplicate={onPageDuplicate}
              onPageRemove={onPageRemove}
              onSortEnd={onPageSort}
              pages={pages}
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

AllSlidesPanel.propTypes = {
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  onPageAdd: PropTypes.func,
  onPageDuplicate: PropTypes.func,
  onPageOrdersChange: PropTypes.func,
  onPageRemove: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

AllSlidesPanel.defaultProps = {
  additionalPageItems: [],
  hashCode: '',
  itemAccessor: () => {},
  onPageAdd: () => {},
  onPageDuplicate: () => {},
  onPageOrdersChange: () => {},
  onPageRemove: () => {},
  pages: [],
};

export default memo(AllSlidesPanel);
