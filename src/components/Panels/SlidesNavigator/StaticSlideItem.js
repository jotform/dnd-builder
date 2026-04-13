import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as classNames from '../../../constants/classNames';
import ReportItemRenderer from '../../Builder/ReportItemRenderer';
import StaticItem from '../../Preview/StaticItem';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import { usePropStore } from '../../../contexts/PropContext';

const THUMBNAIL_MAX_WIDTH = 124;
const THUMBNAIL_MAX_HEIGHT = 88.5;

const wrapperStyle = {
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
};

const StaticSlideItem = ({
  backgroundColor,
  items = [],
  reportHeight,
  reportWidth,
}) => {
  const itemAccessor = usePropStore(state => state.itemAccessor);
  const additionalPageItems = usePropStore(state => state.additionalPageItems);

  const containerStyle = useMemo(() => {
    const scale = Math.min(
      THUMBNAIL_MAX_WIDTH / reportWidth,
      THUMBNAIL_MAX_HEIGHT / reportHeight,
    );

    const scaledWidth = reportWidth * scale;
    const scaledHeight = reportHeight * scale;

    return {
      backgroundColor: backgroundColor || '#fff',
      borderRadius: '4px',
      height: reportHeight,
      left: (THUMBNAIL_MAX_WIDTH - scaledWidth) / 2,
      position: 'absolute',
      top: (THUMBNAIL_MAX_HEIGHT - scaledHeight) / 2,
      transform: `scale(${scale})`,
      transformOrigin: '0 0',
      width: reportWidth,
    };
  }, [reportWidth, reportHeight, backgroundColor]);

  return (
    <div style={wrapperStyle}>
      <ErrorBoundary
        isStatic={true}
        level="page"
      >
        <div
          className={classNames.pageContainer}
          style={containerStyle}
        >
          <div className="jfReport-hider o-hidden f-all p-relative">
            {items.filter(item => (
              item.isVisible !== undefined
                ? item.isVisible
                : true
            )).map(item => {
              return (
                <StaticItem
                  key={item.id}
                  item={item}
                >
                  <ReportItemRenderer
                    item={item}
                  >
                    {(ReportItem, mergedItem) => (
                      <ReportItem
                        isThumbnail
                        item={mergedItem}
                        itemAccessor={itemAccessor}
                      />
                    )}
                  </ReportItemRenderer>
                </StaticItem>
              );
            })}
            {additionalPageItems}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

StaticSlideItem.propTypes = {
  backgroundColor: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  reportHeight: PropTypes.number.isRequired,
  reportWidth: PropTypes.number.isRequired,
};

export default memo(StaticSlideItem);
