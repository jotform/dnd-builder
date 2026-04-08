import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import ReportWrapper from '../ReportWrapper';
import { usePropStore } from '../../contexts/PropContext';
import { useBuilderStore } from '../../contexts/BuilderContext';
import {
  useFitZoom, usePageVisibility, usePrevious, useSelectedElements,
} from '../../utils/hooks';
import SlidesNavigator from '../Panels/SlidesNavigator/SlidesNavigator';
import { isSlidesListType } from '../../utils/functions';

const BuilderWrapper = ({ children }) => {
  const decidedWhichPanelToOpen = useRef(false);

  const pageCount = usePropStore(state => state.pages.length);
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);
  const isSlidesNavigatorOpen = useBuilderStore(state => state.isSlidesNavigatorOpen);
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);
  const setIsSlidesNavigatorOpen = useBuilderStore(state => state.setIsSlidesNavigatorOpen);
  const shouldShowRightPanelInitially = useBuilderStore(state => state.shouldShowRightPanelInitially);
  const onSelectedItemsChanged = usePropStore(state => state.onSelectedItemsChanged);
  const onPageVisibilityChanged = usePropStore(state => state.onPageVisibilityChanged);
  const setVisiblePageOrder = useBuilderStore(state => state.setVisiblePageOrder);
  const slidesListType = useBuilderStore(state => state.slidesListType);
  const selectedItems = useSelectedElements();
  const prevSelectedItems = usePrevious(selectedItems);

  useEffect(() => {
    if (prevSelectedItems && !isEqual(prevSelectedItems, selectedItems)) {
      onSelectedItemsChanged(selectedItems);
    }
  }, [
    selectedItems,
    onSelectedItemsChanged,
    prevSelectedItems,
  ]);

  const handlePageVisibility = useCallback(index => {
    if (index && !Number.isNaN(index)) {
      setVisiblePageOrder(index);
      onPageVisibilityChanged(index);
    }
  }, [setVisiblePageOrder, onPageVisibilityChanged]);

  // for initial page visibility check and slides panel visibility usage
  const selectedPageIndexReference = isSlidesPanelOpen ? 0 : -1;
  usePageVisibility(handlePageVisibility, pageCount, selectedPageIndexReference);

  useFitZoom();

  useEffect(() => {
    if (!decidedWhichPanelToOpen.current) {
      if (pageCount > 1) {
        if (isLeftPanelOpen) {
          setIsLeftPanelOpen(false);
        }
        if (isSlidesListType(slidesListType, 'NAVIGATOR')) {
          setIsSlidesNavigatorOpen(true);
        }
        setIsSlidesPanelOpen(shouldShowRightPanelInitially);
      } else {
        if (isSlidesPanelOpen) {
          setIsSlidesPanelOpen(false);
        }
        if (isSlidesListType(slidesListType, 'NAVIGATOR') && isSlidesNavigatorOpen) {
          setIsSlidesNavigatorOpen(false);
        }
        setIsLeftPanelOpen(true);
      }

      decidedWhichPanelToOpen.current = true;
    }
  }, [pageCount, isLeftPanelOpen, isSlidesPanelOpen, isSlidesNavigatorOpen, setIsLeftPanelOpen, setIsSlidesPanelOpen, setIsSlidesNavigatorOpen, shouldShowRightPanelInitially, slidesListType]);

  return (
    <>
      {isSlidesListType(slidesListType, 'NAVIGATOR') && <SlidesNavigator />}
      <ReportWrapper mode="customize">
        {children}
      </ReportWrapper>
    </>
  );
};

BuilderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BuilderWrapper;
