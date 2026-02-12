import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import ReportWrapper from '../ReportWrapper';
import { usePropStore } from '../../contexts/PropContext';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { useFitZoom, usePrevious, useSelectedElements } from '../../utils/hooks';

const BuilderWrapper = ({ children }) => {
  const decidedWhichPanelToOpen = useRef(false);

  const pageCount = usePropStore(state => state.pages.length);
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);
  const onSelectedItemsChanged = usePropStore(state => state.onSelectedItemsChanged);
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

  useFitZoom();

  useEffect(() => {
    if (!decidedWhichPanelToOpen.current) {
      if (pageCount > 1) {
        if (isLeftPanelOpen) {
          setIsLeftPanelOpen(false);
        }
        setIsSlidesPanelOpen(true);
      } else {
        if (isSlidesPanelOpen) {
          setIsSlidesPanelOpen(false);
        }
        setIsLeftPanelOpen(true);
      }

      decidedWhichPanelToOpen.current = true;
    }
  }, [
    pageCount,
    isLeftPanelOpen,
    isSlidesPanelOpen,
    setIsLeftPanelOpen,
    setIsSlidesPanelOpen,
  ]);

  return (
    <ReportWrapper mode="customize">
      {children}
    </ReportWrapper>
  );
};

BuilderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BuilderWrapper;
