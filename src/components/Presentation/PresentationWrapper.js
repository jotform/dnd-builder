import {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import classNames from 'classnames';
import { useGesture } from 'react-use-gesture';
import PresentationBar from './PresentationBar';
import ProgressBar from './ProgressBar';
import { useBuilderContext } from '../../utils/builderContext';
import { useEventListener, useFullscreenChange } from '../../utils/hooks';
import {
  changePage,
  throttle,
  zoomHandler,
} from '../../utils/functions';
import { usePresentationContext } from '../../utils/presentationContext';
import { usePropContext } from '../../utils/propContext';
// import { ZOOM_MIN, ZOOM_MAX } from '../../constants/zoom';

const PresentationWrapper = ({
  children,
  presentationBarActions,
  useFixedPresentationBar,
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
  } = usePresentationContext();

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

  const gesture = useGesture({
    onDragEnd: ({
      axis, direction: [v], distance, event,
    }) => {
      event.preventDefault();
      if (fittedZoom === zoom) {
        const { clientWidth } = event.target;
        if (axis === 'x'
        && window.innerWidth / 4 < distance
        && clientWidth * zoom < window.innerWidth) {
          return v < 0 ? pageChanger(1)() : pageChanger(-1)();
        }
      }
    },
    // onPinchEnd: ({ movement: [d] }) => {
    //   const zoomStep = Number(parseFloat(d / 1000).toFixed(1));
    //   const newZoomValue = Number(((Math.round((zoom + zoomStep) * 10)) / 10).toFixed(2));
    //   if (zoom !== newZoomValue && newZoomValue <= ZOOM_MAX) {
    //     const minZoom = Math.min(fittedZoom, ZOOM_MIN);
    //     setZoom(Math.max(newZoomValue, minZoom));
    //   }
    // },
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

PresentationWrapper.defaultProps = {
  children: () => {},
  presentationBarActions: [],
  useFixedPresentationBar: false,
};

export default PresentationWrapper;
