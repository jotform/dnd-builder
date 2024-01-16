import { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FixedSizeList } from 'react-window';
import Panel from '../../Builder/Panel';
import SortablePageList from './SortablePageList';
import Section from '../../Builder/Section';
import { useBuilderContext } from '../../../utils/builderContext';
import { usePropContext } from '../../../utils/propContext';
import { arrayMove } from '../../../utils/functions';
import SlidesPanelToggler from './SlidesPanelToggler';
import ListWrapper from './ListWrapper';
import Button from '../../Settings/Button';
import { useClickOutsideListener, useTranslatedTexts } from '../../../utils/hooks';

const SlidesPanel = ({
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
    isRightPanelOpen,
    isSlidesPanelOpen,
    setIsAllSlidesPanelOpen,
    setIsSlidesPanelOpen,
  } = useBuilderContext();
  const {
    acceptedItems,
    disableInteraction,
    onAnEventTrigger,
    settings: reportSettings,
    useExperimentalFeatures,
  } = usePropContext();
  const [animationEnd, setAnimationEnd] = useState(true);

  const pageGetter = useCallback(index => {
    return pages[index];
  }, [pages]);

  const onPageSort = useCallback(({ newIndex, oldIndex }, nativeEvent, list) => {
    const newPageOrders = arrayMove(pages, oldIndex, newIndex).reduce((acc, page, index) => {
      acc[page.id] = { order: index + 1 };
      return acc;
    }, {});

    onPageOrdersChange(newPageOrders);
    onAnEventTrigger('sortPageFromSlides');

    list.forceUpdate();
  }, [pages]);

  // Panel className
  const panelAdditionalClassName = classNames(
    'jfReport-settings forSlides f-height',
    {
      isIdle: !isSlidesPanelOpen,
      otherOpened: isRightPanelOpen,
    },
  );

  const onClosePanel = () => {
    setAnimationEnd(false);
    setIsSlidesPanelOpen(false);
  };

  const onAnimationEnd = useCallback(() => {
    if (!isSlidesPanelOpen) {
      setAnimationEnd(true);
    }
  }, [isSlidesPanelOpen]);

  useClickOutsideListener(
    ['jfReport-canvas', 'jfReport-viewport', 'jfReport-pageInfo'],
    isSlidesPanelOpen,
    onClosePanel,
  );

  const { SLIDES } = useTranslatedTexts();

  return (
    <Panel
      additionalClassName={panelAdditionalClassName}
      onAnimationEnd={onAnimationEnd}
    >
      {isRightPanelOpen
        ? null
        : <SlidesPanelToggler onClosePanel={onClosePanel} />}
      {(isSlidesPanelOpen || (!isSlidesPanelOpen && !animationEnd)) && (
        <div className="toolItemWrapper f-height d-flex dir-col">
          <Section
            additionalComponent={useExperimentalFeatures ? (
              <Button
                classNames="jfReportButton isAccent showAll"
                icon="allSlides"
                onClick={() => setIsAllSlidesPanelOpen(true)}
                title="Show All"
              />
            ) : null}
            icon="slides"
            title={SLIDES}
          >
            <div className="toolItem-tabContent hasInnerScroll">
              <ListWrapper
                acceptedItems={acceptedItems}
                additionalPageItems={additionalPageItems}
                component={SortablePageList(FixedSizeList)}
                disableInteraction={disableInteraction}
                hashCode={hashCode}
                itemAccessor={itemAccessor}
                onAnEventTrigger={onAnEventTrigger}
                onPageAdd={onPageAdd}
                onPageDuplicate={onPageDuplicate}
                onPageRemove={onPageRemove}
                onSortEnd={onPageSort}
                pageCount={pages.length}
                pageGetter={pageGetter}
                reportSettings={reportSettings}
              />
            </div>
          </Section>
        </div>
      )}
    </Panel>
  );
};

SlidesPanel.propTypes = {
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

SlidesPanel.defaultProps = {
  additionalPageItems: [],
  hashCode: '',
  itemAccessor: () => { },
  onPageAdd: () => { },
  onPageDuplicate: () => { },
  onPageOrdersChange: () => { },
  onPageRemove: () => { },
  pages: [],
};

export default memo(SlidesPanel);
