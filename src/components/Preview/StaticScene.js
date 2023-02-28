import {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import cNames from 'classnames';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import * as classNames from '../../constants/classNames';
import StaticPage from './StaticPage';
import { usePropContext } from '../../utils/propContext';
import { useBuilderContext } from '../../utils/builderContext';
import { slugify } from '../../utils/string';
import { usePageTransition } from '../../utils/hooks';
import { usePresentationContext } from '../../utils/presentationContext';
import ZoomControls from '../Builder/ZoomControls';

const StaticScene = ({
  additionalPageItems,
  gesture,
  hashCode,
  hideZoom,
  itemAccessor,
  lastScrollPosition,
  mode,
  pages,
  presentationPage,
}) => {
  const { fittedZoom, isFullscreen, showControlsInFullScreen } = usePresentationContext();
  const { acceptedItems, settings } = usePropContext();
  const { setZoom, zoom } = useBuilderContext();
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
    if (mode === 'print') {
      setZoom(1);
    }
  }, [mode]);

  useEffect(() => {
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, []); // set last scroll position after changing mode

  useEffect(() => {
    transformRefs.current = transformRefs.current.slice(0, pages.length);
  }, [pages]);

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
  }, []);

  useEffect(() => {
    if (transformRefs.current.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        transformRefs.current[i].centerView(zoom);
      }
    }
  }, [pages.length, zoom, isFullscreen]);

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
              >
                <TransformWrapper
                  ref={element => { transformRefs.current[index] = element; }}
                  centerOnInit={true}
                  centerZoomedOut={true}
                  disablePadding={true}
                  doubleClick={{
                    step: 0.2,
                  }}
                  initialScale={zoom}
                  maxScale={2}
                  minScale={0.5}
                  onZoom={handleZoom}
                  panning={{
                    disabled: zoom <= fittedZoom,
                  }}
                  pinch={{
                    step: 1,
                  }}
                >
                  <TransformComponent
                    wrapperStyle={{ height: '100%', width: '100%' }}
                  >
                    <StaticPage
                      acceptedItems={acceptedItems}
                      additionalPageItems={additionalPageItems}
                      hashCode={hashCode}
                      itemAccessor={itemAccessor}
                      items={page.items}
                      style={style}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            );
          })}
        </div>
      </div>
      <ZoomControls
        pages={pages}
        showZoom={(!isFullscreen || (isFullscreen && showControlsInFullScreen)) && !hideZoom}
      />
    </main>
  );
};

StaticScene.propTypes = {
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  gesture: PropTypes.func,
  hashCode: PropTypes.string,
  hideZoom: PropTypes.bool,
  itemAccessor: PropTypes.func,
  lastScrollPosition: PropTypes.number,
  mode: PropTypes.string,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  presentationPage: PropTypes.number,
};

StaticScene.defaultProps = {
  additionalPageItems: [],
  gesture: () => {},
  hashCode: '',
  hideZoom: false,
  itemAccessor: () => {},
  lastScrollPosition: 0,
  mode: 'preview',
  pages: [],
  presentationPage: 0,
};

export default StaticScene;
