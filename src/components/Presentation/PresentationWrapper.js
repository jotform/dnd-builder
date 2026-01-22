import {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import classNames from 'classnames';
import { useDrag } from '@use-gesture/react';
import PresentationBar from './PresentationBar';
import ProgressBar from './ProgressBar';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { useEventListener, useFullscreenChange } from '../../utils/hooks';
import {
  changePage,
  getZoomValue,
  throttle,
} from '../../utils/functions';
import { usePresentationStore } from '../../contexts/PresentationContext';
import { usePropStore } from '../../contexts/PropContext';
// import { ZOOM_MIN, ZOOM_MAX } from '../../constants/zoom';

const PresentationWrapper = ({
  children = () => {},
}) => {
  const settings = usePropStore(state => state.settings);
  const currentPage = usePresentationStore(state => state.currentPage);
  const fittedZoom = usePresentationStore(state => state.fittedZoom);
  const isFullscreen = usePresentationStore(state => state.isFullscreen);
  const pageCount = usePresentationStore(state => state.pageCount);
  const setCurrentPage = usePresentationStore(state => state.setCurrentPage);
  const setFittedZoom = usePresentationStore(state => state.setFittedZoom);
  const setShowControlsInFullScreen = usePresentationStore(state => state.setShowControlsInFullScreen);
  const showControlsInFullScreen = usePresentationStore(state => state.showControlsInFullScreen);
  const useFixedPresentationBar = usePresentationStore(state => state.useFixedPresentationBar);

  const setZoom = useBuilderStore(state => state.setZoom);
  const zoom = useBuilderStore(state => state.zoom);

  const fitToScreen = useCallback((delay = 0) => setTimeout(() => {
    const newZoom = getZoomValue({
      isFullscreen,
      limitZoom: false,
      settings: {
        reportLayoutHeight: settings.reportLayoutHeight,
        reportLayoutWidth: settings.reportLayoutWidth,
      },
      useFixedPresentationBar,
      useProgressBar: pageCount > 2,
    });
    setZoom(newZoom);
    setFittedZoom(newZoom);
  }, delay), [
    settings.reportLayoutHeight,
    settings.reportLayoutWidth,
    isFullscreen,
    useFixedPresentationBar,
    pageCount,
    setZoom,
    setFittedZoom,
  ]);

  useEffect(() => {
    fitToScreen(100);
  }, [isFullscreen, fitToScreen]);

  useEffect(() => {
    if (isFullscreen) {
      setShowControlsInFullScreen(true);
      setTimeout(() => setShowControlsInFullScreen(false), 1500);
    }
  }, [isFullscreen, setShowControlsInFullScreen]);

  const pageChanger = useCallback(action => changePage({
    action,
    currentPage,
    pageCount,
    setCurrentPage,
  }), [currentPage, pageCount, setCurrentPage]);

  const handleKeyboardEvent = useCallback(e => {
    if (e.keyCode === 39) {
      pageChanger(1)();
    } else if (e.keyCode === 37) {
      pageChanger(-1)();
    }
  }, [pageChanger]);

  const setControlVisibility = e => {
    // TODO :: timeout in n out for better ux
    if (!isFullscreen) return;
    if (showControlsInFullScreen && window.innerHeight - e.clientY >= 200) {
      setShowControlsInFullScreen(false);
    } else if (!showControlsInFullScreen && window.innerHeight - e.clientY < 200) {
      setShowControlsInFullScreen(true);
    }
  };

  useEventListener('keydown', handleKeyboardEvent);
  useEventListener('mousemove', throttle(setControlVisibility, 150));
  useEventListener('gesturestart', e => e.preventDefault());
  useEventListener('gesturechange', e => e.preventDefault());
  useFullscreenChange(isFullscreen, fitToScreen);

  const gesture = useDrag(({
    active, movement: [mx], direction: [xDir], cancel,
  }) => {
    if (fittedZoom === zoom) {
      if (active && Math.abs(mx) > window.innerWidth / 2) {
        const direction = xDir < 0 ? 1 : -1;
        cancel();
        pageChanger(direction)();
      }
    }
  });

  return (
    <>
      <Modal
        appElement={document.getElementById('root')}
        className={classNames('jfPresentation jfFields', { black: isFullscreen })}
        closeTimeoutMS={300}
        contentLabel="Report Presentation"
        id="presentationModal"
        isOpen={true}
        overlayClassName={classNames(
          'jfPresentation-overlay',
          { fixedPresentationBar: useFixedPresentationBar, isFullscreen },
        )}
        portalClassName="PresentationModal"
        shouldCloseOnEsc={false}
        shouldFocusAfterRender={false}
      >
        {children(currentPage - 1, gesture)}
        <PresentationBar
          fitToScreen={fitToScreen}
          isVisible={(!isFullscreen || (isFullscreen && showControlsInFullScreen))}
        />
        <ProgressBar
          currentPage={currentPage}
          pageCount={pageCount}
        />
      </Modal>
    </>
  );
};

PresentationWrapper.propTypes = {
  children: PropTypes.any,
};

export default PresentationWrapper;
