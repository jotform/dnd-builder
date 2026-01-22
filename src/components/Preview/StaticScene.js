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
    if (transformRefs.current.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        transformRefs.current[i].centerView(zoom);
      }
    }
  }, [pages.length, zoom]);

  return (
    <main
      className={classNames.mainWrapper}
    >
      <div
        ref={viewPortRef}
        className={classNames.viewport}
        {...gesture()}
      >
        <div
          className={`${classNames.canvas} ${reportPageTransition}`}
          style={transitionStyle}
        >
          {pages.map((page, index) => {
            const { backgroundColor } = page;
            const style = {
              ...pageContainerStyles,
              backgroundColor: backgroundColor ? backgroundColor : reportBackgroundColor || '#fff',
            };
            return (
              <div
                key={`page_${index.toString()}`}
                className={cNames({
                  [classNames.page]: true,
                  [slugify(reportLayout)]: true,
                  activePage: index === presentationPage,
                })}
                id={`presentation-page-${page.id.toString()}`}
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
      <ZoomControls
        showZoom={(!isFullscreen || (isFullscreen && showControlsInFullScreen)) && !hideZoom}
      />
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
