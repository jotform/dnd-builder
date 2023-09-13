import { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import PageNavigation from './PageNavigation';
import PresentationActions from './PresentationActions';
import SelectZoom from './SelectZoom';
import {
  changePage,
  closeFullscreen,
  openFullscreenHelper,
} from '../../../utils/functions';

const PresentationBar = ({
  currentPage,
  fitToScreen,
  fittedZoom,
  isFullscreen,
  isVisible,
  onAnEventTrigger,
  pageCount,
  presentationBarActions,
  setCurrentPage,
  setIsFullscreen,
  setZoom,
  settings,
  zoom,
}) => {
  const { reportLayoutWidth = 1123 } = settings;

  const toggleFullscreen = goFullscreen => () => {
    if (goFullscreen) {
      const openRequest = openFullscreenHelper();
      if (openRequest && openRequest.then) {
        openRequest.then(fitToScreen);
      } else {
        fitToScreen(500);
      }
    } else {
      const closeRequest = closeFullscreen();
      if (closeRequest && closeRequest.then) {
        closeRequest.then(fitToScreen);
      } else {
        fitToScreen(600); // magic number for safari :(
      }
    }

    onAnEventTrigger('clickedFullscreen');
    setIsFullscreen(goFullscreen);
  };

  const pageChanger = action => changePage({
    action,
    currentPage,
    pageCount,
    setCurrentPage,
  });

  useLayoutEffect(() => {
    // Hi, this is a horrible solution to a horrible Chromium bug.
    // It is temporary, and once chromium crew solves the
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1440024
    // we will be able to remove it, the idea itself comes from
    // them, btw https://bugs.chromium.org/p/chromium/issues/detail?id=1440024#c3
    if (window.chrome) {
      // Detaching and re-attaching to dom likely forces a re-draw
      // of the svg.
      document.querySelectorAll('svg.recharts-surface').forEach(domNode => {
        const parent = domNode.parentElement;
        parent.removeChild(domNode);
        parent.appendChild(domNode);
      });
    }
  });

  const handleZoomChange = e => {
    setZoom(e.target.value / 100, false, reportLayoutWidth);
    e.target.blur(); // prevent mixup with other keyboard shortcuts
  };

  return (
    <div className="jfPresentation-barContainer d-flex j-center f-width">
      <div
        className={`
          floatingController p-relative d-flex a-center j-between w-fit forBar
          ${isVisible ? '' : ' hidden'}
        `}
      >
        <div className="toolSection-dropdownWrapper isDark">
          <SelectZoom
            fittedZoom={fittedZoom}
            handleZoomChange={handleZoomChange}
            zoom={zoom}
          />
        </div>
        {pageCount > 1 && (
          <>
            <div className="divider" />
            <PageNavigation
              currentPage={currentPage}
              decrease={pageChanger(-1)}
              increase={pageChanger(1)}
              isVisible={pageCount > 1}
              pageCount={pageCount}
            />
            <div className="divider" />
          </>
        )}
        <PresentationActions
          isFullscreen={isFullscreen}
          presentationBarActions={presentationBarActions}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
};

PresentationBar.propTypes = {
  currentPage: PropTypes.number,
  fitToScreen: PropTypes.func,
  fittedZoom: PropTypes.number,
  isFullscreen: PropTypes.bool,
  isVisible: PropTypes.bool,
  onAnEventTrigger: PropTypes.func,
  pageCount: PropTypes.number,
  presentationBarActions: PropTypes.arrayOf(PropTypes.shape({})),
  setCurrentPage: PropTypes.func,
  setIsFullscreen: PropTypes.func,
  setZoom: PropTypes.func,
  settings: PropTypes.shape({
    reportLayoutWidth: PropTypes.string,
  }),
  zoom: PropTypes.number,
};

PresentationBar.defaultProps = {
  currentPage: 1,
  fitToScreen: f => f,
  fittedZoom: 1,
  isFullscreen: false,
  isVisible: true,
  onAnEventTrigger: f => f,
  pageCount: 1,
  presentationBarActions: [],
  setCurrentPage: f => f,
  setIsFullscreen: f => f,
  setZoom: f => f,
  settings: {},
  zoom: 1,
};

export default PresentationBar;
