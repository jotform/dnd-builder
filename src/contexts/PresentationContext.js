import { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { createStore, useStore } from 'zustand';

const presentationStore = props => {
  return createStore(set => ({
    currentPage: props.currentPage || 1,
    fittedZoom: 1,
    isFullscreen: props.isFullscreen || false,
    pageCount: props.pageCount || 0,
    setCurrentPage: currentPage => set({ currentPage }),
    setFittedZoom: fittedZoom => set({ fittedZoom }),
    setIsFullscreen: isFullscreen => set({ isFullscreen }),
    setShowControlsInFullScreen: showControlsInFullScreen => set({ showControlsInFullScreen }),
    setShowZoomInFullScreen: showZoomInFullScreen => set({ showZoomInFullScreen }),
    showControlsInFullScreen: false,
    showZoomInFullScreen: false,
  }));
};

const PresentationContext = createContext(null);

export const PresentationProvider = ({ children, ...props }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = presentationStore(props);
  }

  return (
    <PresentationContext.Provider value={storeRef.current}>
      {children}
    </PresentationContext.Provider>
  );
};

PresentationProvider.propTypes = {
  children: PropTypes.any,
  currentPage: PropTypes.number,
  isFullscreen: PropTypes.bool,
  pageCount: PropTypes.number,
};

export const PresentationConsumer = PresentationContext.Consumer;

export const usePresentationStore = selector => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('PresentationContext must be used with PresentationProvider!');
  }
  return useStore(context, selector);
};
