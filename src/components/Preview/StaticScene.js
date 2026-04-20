import {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import cNames from 'classnames';
import * as classNames from '../../constants/classNames';
import { StaticPageWithZoomPanPinch } from './StaticPage';
import { usePropStore } from '../../contexts/PropContext';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { slugify } from '../../utils/string';
import { usePageTransition } from '../../utils/hooks';
import { usePresentationStore } from '../../contexts/PresentationContext';
import ZoomControls from '../Builder/ZoomControls';

const StaticScene = ({
  gesture = () => {},
  hideZoom = false,
  mode = '',
  presentationPage = 0,
}) => {
  const setZoom = useBuilderStore(state => state.setZoom);
  const zoom = useBuilderStore(state => state.zoom);

  const isFullscreen = usePresentationStore(state => state.isFullscreen);
  const showControlsInFullScreen = usePresentationStore(state => state.showControlsInFullScreen);

  const settings = usePropStore(state => state.settings);
  const pages = usePropStore(state => state.pages);

  const viewPortRef = useRef({});
  const transformRefs = useRef([]);

  const {
    reportBackgroundColor,
    reportLayout = 'A4 Landscape',
    reportLayoutHeight = 794,
    reportLayoutWidth = 1123,
    reportPageTransition = 'noAnimation',
  } = settings;
  const width = parseInt(reportLayoutWidth, 10);
  const height = parseInt(reportLayoutHeight, 10);
  const zoomToUse = Number.isNaN(zoom) ? 1 : zoom;
  const isPreviewCssZoom = mode === 'preview';

  useEffect(() => {
    transformRefs.current = transformRefs.current.slice(0, pages.length);
  }, [pages.length]);

  const pageContainerStyles = useMemo(() => ({
    height,
    width,
  }), [width, height]);

  const transitionStyle = usePageTransition(reportPageTransition, presentationPage);

  const handleZoom = useCallback(zoomPanPinch => {
    const fixedValue = parseFloat(zoomPanPinch.state.scale.toFixed(2));
    const roundValue = parseFloat((Math.round((fixedValue * 100)) / 100).toFixed(1));
    if (roundValue <= 2 && roundValue >= 0.5) {
      setZoom(roundValue);
    }
  }, [setZoom]);

  useEffect(() => {
    if (mode !== 'presentation') {
      return;
    }
    if (transformRefs.current.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        transformRefs.current[i]?.centerView?.(zoom);
      }
    }
  }, [pages.length, zoom, mode]);

  const isEnabledZoomControls = (!isFullscreen || (isFullscreen && showControlsInFullScreen)) && !hideZoom;

  return (
    <main
      className={classNames.mainWrapper}
    >
      <div
        ref={viewPortRef}
        className={classNames.viewport}
        data-zoom={isPreviewCssZoom ? zoom : undefined}
        {...gesture()}
      >
        <div
          className={`${classNames.canvas} ${reportPageTransition}`}
          style={transitionStyle}
        >
          {pages.map((page, index) => {
            const { backgroundColor } = page;
            const bg = backgroundColor ? backgroundColor : reportBackgroundColor || '#fff';

            const style = isPreviewCssZoom ? {
              backgroundColor: bg,
              height,
              transform: `scale(${zoomToUse})`,
              transformOrigin: '0 0',
              width,
            } : {
              ...pageContainerStyles,
              backgroundColor: bg,
            };

            const pageOuterStyle = isPreviewCssZoom ? {
              height: parseFloat((height * zoomToUse).toFixed(1)),
              position: 'relative',
              width: parseFloat((width * zoomToUse).toFixed(1)),
            } : undefined;

            return (
              <div
                key={`page_${index.toString()}`}
                className={cNames({
                  [classNames.page]: true,
                  [slugify(reportLayout)]: true,
                  activePage: index === presentationPage,
                })}
                data-id={page.id}
                id={`presentation-page-${page.id.toString()}`}
                style={pageOuterStyle}
              >
                <StaticPageWithZoomPanPinch
                  handleZoom={handleZoom}
                  items={page.items}
                  mode={mode}
                  refSetter={element => { transformRefs.current[index] = element; }}
                  style={style}
                />
              </div>
            );
          })}
        </div>
      </div>
      {isEnabledZoomControls && (
        <div className="bottom-actions-container">
          <ZoomControls />
        </div>
      )}
    </main>
  );
};

StaticScene.propTypes = {
  gesture: PropTypes.func,
  hideZoom: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  presentationPage: PropTypes.number,
};

export default StaticScene;
