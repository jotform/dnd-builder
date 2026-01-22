import {
  createContext, useContext, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { createStore, useStore } from 'zustand';
import { usePropStore } from './PropContext';

const presentationStore = props => {
  return createStore(set => ({
    currentPage: props.currentPage || 1,
    fittedZoom: 1,
    isFullscreen: props.isFullscreen || false,
    pageCount: 0,
    presentationBarActions: props.presentationBarActions || [],
    setCurrentPage: currentPage => set({ currentPage }),
    setFittedZoom: fittedZoom => set({ fittedZoom }),
    setIsFullscreen: isFullscreen => set({ isFullscreen }),
    setPageCount: pageCount => set({ pageCount }),
    setPresentationBarActions: presentationBarActions => set({ presentationBarActions }),
    setShowControlsInFullScreen: showControlsInFullScreen => set({ showControlsInFullScreen }),
    setShowZoomInFullScreen: showZoomInFullScreen => set({ showZoomInFullScreen }),
    setUseFixedPresentationBar: useFixedPresentationBar => set({ useFixedPresentationBar }),
    showControlsInFullScreen: false,
    showZoomInFullScreen: false,
    useFixedPresentationBar: props.useFixedPresentationBar || false,
  }));
};

const PresentationContext = createContext(null);

export const PresentationProvider = ({ children, ...props }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = presentationStore(props);
  }

  const pages = usePropStore(state => state.pages);

  useEffect(() => {
    const { setPageCount } = storeRef.current.getState();
    setPageCount(pages.length);
  }, [pages]);

  const { presentationBarActions } = props;
  useEffect(() => {
    const { setPresentationBarActions } = storeRef.current.getState();
    if (presentationBarActions) {
      setPresentationBarActions(presentationBarActions);
    }
  }, [presentationBarActions]);

  const { useFixedPresentationBar } = props;
  useEffect(() => {
    const { setUseFixedPresentationBar } = storeRef.current.getState();
    if (useFixedPresentationBar) {
      setUseFixedPresentationBar(useFixedPresentationBar);
    }
  }, [useFixedPresentationBar]);

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
  presentationBarActions: PropTypes.array,
  useFixedPresentationBar: PropTypes.bool,
};

export const PresentationConsumer = PresentationContext.Consumer;

export const usePresentationStore = selector => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentationStore must be used with PresentationProvider!');
  }
  return useStore(context, selector);
};
