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
import { useBuilderContext } from '../../contexts/BuilderContext';
import { useEventListener, useFullscreenChange } from '../../utils/hooks';
import {
  changePage,
  throttle,
  zoomHandler,
} from '../../utils/functions';
import { usePresentationStore } from '../../contexts/PresentationContext';
import { usePropContext } from '../../contexts/PropContext';
// import { ZOOM_MIN, ZOOM_MAX } from '../../constants/zoom';

const PresentationWrapper = ({
  children = () => {},
  presentationBarActions = [],
  useFixedPresentationBar = false,
}) => {
  const { onAnEventTrigger, settings } = usePropContext();
  const {
    currentPage,
    fittedZoom,
    isFullscreen,
    pageCount,
    setCurrentPage,
    setFittedZoom,
    setIsFullscreen,
    setShowControlsInFullScreen,
    showControlsInFullScreen,
  } = usePresentationStore();

  const { setZoom, zoom } = useBuilderContext();

  const fitToScreen = useCallback((delay = 0) => setTimeout(() => {
    const newZoom = zoomHandler({
      handler: setZoom,
      isFullscreen,
      isModeCustomize: false,
      limitZoom: false,
      settings,
      useFixedPresentationBar,
      useProgressBar: pageCount > 2,
    });
    setFittedZoom(newZoom);
  }, delay), [settings, isFullscreen, useFixedPresentationBar, pageCount]);

  useEffect(() => { fitToScreen(100); }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      setShowControlsInFullScreen(true);
      setTimeout(() => setShowControlsInFullScreen(false), 1500);
    }
  }, [isFullscreen]);

  const pageChanger = action => changePage({
    action,
    currentPage,
    pageCount,
    setCurrentPage,
  });

  const handleKeyboardEvent = useCallback(e => {
    if (e.keyCode === 39) {
      pageChanger(1)();
    } else if (e.keyCode === 37) {
      pageChanger(-1)();
    }
  });

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
  useFullscreenChange(isFullscreen, setIsFullscreen, fitToScreen);

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
          currentPage={currentPage}
          fittedZoom={fittedZoom}
          fitToScreen={fitToScreen}
          isFullscreen={isFullscreen}
          isVisible={(!isFullscreen || (isFullscreen && showControlsInFullScreen))}
          onAnEventTrigger={onAnEventTrigger}
          pageCount={pageCount}
          presentationBarActions={presentationBarActions}
          setCurrentPage={setCurrentPage}
          setIsFullscreen={setIsFullscreen}
          settings={settings}
          setZoom={setZoom}
          zoom={zoom}
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
  presentationBarActions: PropTypes.arrayOf(PropTypes.shape({})),
  useFixedPresentationBar: PropTypes.bool,
};

export default PresentationWrapper;
