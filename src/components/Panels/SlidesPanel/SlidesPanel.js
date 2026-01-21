import { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import SortablePageList from './SortablePageList';
import Section from '../../Builder/Section';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { usePropStore } from '../../../contexts/PropContext';
import { arrayMove } from '../../../utils/functions';
import SlidesPanelToggler from './SlidesPanelToggler';
import ListWrapper from './ListWrapper';
import Button from '../../Settings/Button';
import { useClickOutsideListener, useTranslatedTexts } from '../../../utils/hooks';

const SlidesPanel = () => {
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const setIsAllSlidesPanelOpen = useBuilderStore(state => state.setIsAllSlidesPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);

  const pages = usePropStore(state => state.pages);
  const onPageOrdersChange = usePropStore(state => state.onPageOrdersChange);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const useExperimentalFeatures = usePropStore(state => state.useExperimentalFeatures);

  const [animationEnd, setAnimationEnd] = useState(true);

  const pageGetter = useCallback(index => {
    return pages[index];
  }, [pages]);

  const onPageSort = useCallback(({ newIndex, oldIndex }) => {
    const newPageOrders = arrayMove(pages, oldIndex, newIndex).reduce((acc, page, index) => {
      acc[page.id] = { order: index + 1 };
      return acc;
    }, {});

    onPageOrdersChange(newPageOrders);
    onAnEventTrigger('sortPageFromSlides');
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
                component={SortablePageList()}
                onSortEnd={onPageSort}
                pageGetter={pageGetter}
              />
            </div>
          </Section>
        </div>
      )}
    </Panel>
  );
};

export default memo(SlidesPanel);
