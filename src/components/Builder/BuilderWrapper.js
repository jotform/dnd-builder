import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReportWrapper from '../ReportWrapper';
import { usePropStore } from '../../contexts/PropContext';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { useFitZoom } from '../../utils/hooks';

const BuilderWrapper = ({ children }) => {
  const decidedWhichPanelToOpen = useRef(false);

  const pageCount = usePropStore(state => state.pages.length);
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);

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
