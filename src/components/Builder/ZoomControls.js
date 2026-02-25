import { useMemo } from 'react';
import * as icons from '../../utils/icons';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';
import {
  ZOOM_STEP,
  ZOOM_MIN,
  ZOOM_MAX,
  ZOOM_MULTIPLIER,
} from '../../constants/zoom';
import { useTranslatedTexts } from '../../utils/hooks';

const ZoomControls = () => {
  const setZoom = useBuilderStore(state => state.setZoom);
  const zoom = useBuilderStore(state => state.zoom);

  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const settings = usePropStore(state => state.settings);

  const { reportLayoutHeight = 794, reportLayoutWidth = 1123 } = settings;
  const decreaseZoom = () => {
    onAnEventTrigger('zoomOut', 'report');
    if (zoom > (ZOOM_STEP + ZOOM_MIN)) {
      setZoom(parseFloat((zoom - ZOOM_STEP).toFixed(1)), reportLayoutWidth);
    }
  };
  const increaseZoom = () => {
    onAnEventTrigger('zoomIn', 'report');
    if (zoom < (ZOOM_MAX)) {
      setZoom(parseFloat((zoom + ZOOM_STEP).toFixed(1)), reportLayoutWidth);
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
    setZoom(newZoom, reportLayoutWidth);
  };

  const zoomValue = useMemo(() => {
    return Number.isNaN(zoom) ? 100 : (zoom * ZOOM_MULTIPLIER).toFixed(0);
  }, [zoom]);

  const { FIT_TO_SCENE, ZOOM_IN, ZOOM_OUT } = useTranslatedTexts();

  return (
    <div className="floatingController zoom-toolbar">
      <div className="floatingController-container">
        <button
          className="controllerItem"
          onClick={increaseZoom}
          title={ZOOM_IN}
          type="button"
        >
          <icons.plus className="toolbar-icon" />
        </button>
        <div className="controllerIndicator">
          {zoomValue}
          %
        </div>
        <button
          className="controllerItem"
          onClick={decreaseZoom}
          title={ZOOM_OUT}
          type="button"
        >
          <icons.minus className="toolbar-icon" />
        </button>
      </div>
      <div className="floatingController-container">
        <button
          className="controllerItem"
          onClick={fitZoom}
          title={FIT_TO_SCENE}
          type="button"
        >
          <icons.fit className="toolbar-icon" />
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;
