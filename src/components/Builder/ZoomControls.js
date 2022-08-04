import { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';
import { useBuilderContext } from '../../utils/builderContext';
import { usePropContext } from '../../utils/propContext';
import {
  ZOOM_STEP,
  ZOOM_MIN,
  ZOOM_MAX,
  ZOOM_MULTIPLIER,
} from '../../constants/zoom';
import { useTranslatedTexts } from '../../utils/hooks';

const ZoomControls = ({
  mode,
  showZoom,
}) => {
  const { setZoom, zoom } = useBuilderContext();
  const {
    onAnEventTrigger,
    settings,
  } = usePropContext();
  const { reportLayoutHeight = 794, reportLayoutWidth = 1123 } = settings;
  const isModeCustomize = mode === 'customize';
  const decreaseZoom = () => {
    onAnEventTrigger('zoomOut', 'report');
    if (zoom > (ZOOM_STEP + ZOOM_MIN)) {
      setZoom(parseFloat((zoom - ZOOM_STEP).toFixed(1)), isModeCustomize, reportLayoutWidth);
    }
  };
  const increaseZoom = () => {
    onAnEventTrigger('zoomIn', 'report');
    if (zoom < (ZOOM_MAX)) {
      setZoom(parseFloat((zoom + ZOOM_STEP).toFixed(1)), isModeCustomize, reportLayoutWidth);
    }
  };
  const fitZoom = () => {
    const { innerHeight, innerWidth } = window;
    const newScale = Math.min(
      (innerWidth - 400) / reportLayoutWidth,
      innerHeight / reportLayoutHeight,
    );
    let newZoom = Math.floor(newScale * 10) / 10;
    if (newZoom < 0.5) newZoom = 0.5;
    if (newZoom > 1) newZoom = 1;
    onAnEventTrigger('fitZoom', 'report');
    setZoom(newZoom, isModeCustomize, reportLayoutWidth);
  };

  const zoomValue = useMemo(() => {
    return Number.isNaN(zoom) ? 100 : (zoom * ZOOM_MULTIPLIER).toFixed(0);
  }, [zoom, ZOOM_MULTIPLIER]);

  const { FIT_TO_SCENE, ZOOM_IN, ZOOM_OUT } = useTranslatedTexts();

  return (
    <div className={`floatingController forZoom${!showZoom ? ' hidden' : ''}`}>
      <div className="floatingController-container isGray">
        <button
          className="controllerItem isWhite"
          onClick={increaseZoom}
          title={ZOOM_IN}
          type="button"
        >
          <icons.plus className="jfReportSVG controllerItem-icon" />
        </button>
        <div className="controllerIndicator">
          {zoomValue}
          %
        </div>
        <button
          className="controllerItem isWhite"
          onClick={decreaseZoom}
          title={ZOOM_OUT}
          type="button"
        >
          <icons.minus className="jfReportSVG controllerItem-icon" />
        </button>
      </div>
      <div className="floatingController-container">
        <button
          className="controllerItem isSingle"
          onClick={fitZoom}
          title={FIT_TO_SCENE}
          type="button"
        >
          <icons.fit className="jfReportSVG icon-fit" />
        </button>
      </div>
    </div>
  );
};

ZoomControls.propTypes = {
  mode: PropTypes.string,
  showZoom: PropTypes.bool,
};

ZoomControls.defaultProps = {
  mode: '',
  showZoom: true,
};

export default ZoomControls;
