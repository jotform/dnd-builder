import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
  const { isFullscreen, showControlsInFullScreen } = usePresentationContext();
  const { acceptedItems, settings } = usePropContext();
  let { zoom } = useBuilderContext();
  const viewPortRef = useRef({});
  const pageStyles = useRef({});
  const pageContainerStyles = useRef({});
  const zoomAdjusterStyles = useRef({});
  zoom = mode === 'print' ? 1 : zoom;
  useEffect(() => {
    if (viewPortRef.current) {
      viewPortRef.current.scrollTop = lastScrollPosition;
    }
  }, []); // set last scroll position after changing mode

  const {
    reportBackgroundColor,
    reportLayout = 'A4 Landscape',
    reportLayoutHeight = 794,
    reportLayoutWidth = 1123,
    reportPageTransition = 'noAnimation',
  } = settings;
  const width = parseInt(reportLayoutWidth, 10);
  const height = parseInt(reportLayoutHeight, 10);
  pageStyles.current = {
    alignItems: 'center',
    justifyContent: 'center',
  };
  pageContainerStyles.current = {
    height,
    transform: `scale(${zoom})`,
    transformOrigin: '0 0',
    width,
  };
  zoomAdjusterStyles.current = {
    height: parseFloat((height * zoom).toFixed(1)),
    margin: '0',
    width: parseFloat((width * zoom).toFixed(1)),
  };

  if (viewPortRef.current.clientWidth < zoomAdjusterStyles.current.width) {
    delete pageStyles.current.justifyContent;
  }

  if (viewPortRef.current.clientHeight < zoomAdjusterStyles.current.height) {
    delete pageStyles.current.alignItems;
  }

  const transitionStyle = usePageTransition(reportPageTransition, presentationPage);

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
              ...pageContainerStyles.current,
              backgroundColor: backgroundColor ? backgroundColor : reportBackgroundColor || '#fff',
            };
            return (
              <div
                key={`page_${index.toString()}`}
                className={`${
                  classNames.page
                } ${
                  slugify(reportLayout)
                } ${
                  index === presentationPage ? 'activePage' : ''
                }`}
                style={pageStyles.current}
              >
                <div
                  className={`jfReport-zoomAdjuster ${mode !== 'preview' ? 'd-flex' : ''}`}
                  style={zoomAdjusterStyles.current}
                >
                  <StaticPage
                    acceptedItems={acceptedItems}
                    additionalPageItems={additionalPageItems}
                    hashCode={hashCode}
                    itemAccessor={itemAccessor}
                    items={page.items}
                    style={style}
                  />
                </div>
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
