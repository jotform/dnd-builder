import {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import cNames from 'classnames';
import * as classNames from '../../constants/classNames';
import { StaticPageWithZoomPanPinch } from './StaticPage';
import { usePropContext } from '../../contexts/PropContext';
import { useBuilderContext } from '../../contexts/BuilderContext';
import { slugify } from '../../utils/string';
import { usePageTransition } from '../../utils/hooks';
import { usePresentationContext } from '../../contexts/PresentationContext';
import ZoomControls from '../Builder/ZoomControls';

const StaticScene = ({
  additionalPageItems = [],
  gesture = () => {},
  hashCode = '',
  hideZoom = false,
  itemAccessor = () => {},
  lastScrollPosition = 0,
  mode = '',
  pages = [],
  presentationPage = 0,
}) => {
  const { isFullscreen, showControlsInFullScreen } = usePresentationContext();
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
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, []); // set last scroll position after changing mode

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
  }, []);

  useEffect(() => {
    if (transformRefs.current.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        transformRefs.current[i].centerView(zoom);
      }
    }
  }, [pages.length, zoom, isFullscreen, mode]);

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
                  acceptedItems={acceptedItems}
                  additionalPageItems={additionalPageItems}
                  handleZoom={handleZoom}
                  hashCode={hashCode}
                  itemAccessor={itemAccessor}
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
  mode: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  presentationPage: PropTypes.number,
};

export default StaticScene;
