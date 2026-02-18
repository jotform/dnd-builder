import { memo } from 'react';
import PropTypes from 'prop-types';
import * as classNames from '../../constants/classNames';
import ReportItemRenderer from '../Builder/ReportItemRenderer';
import StaticItem from './StaticItem';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import withZoomPanPinchHOC from '../withZoomPanPinchHOC';
import { usePropStore } from '../../contexts/PropContext';

const StaticPage = ({
  isThumbnail = false,
  items = [],
  style = {},
}) => {
  const itemAccessor = usePropStore(state => state.itemAccessor);
  const additionalPageItems = usePropStore(state => state.additionalPageItems);
  return (
    <ErrorBoundary
      isStatic={true}
      level="page"
    >
      <div
        className={classNames.pageContainer}
        style={style}
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
                      isThumbnail={isThumbnail}
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
  );
};

StaticPage.propTypes = {
  isThumbnail: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  style: PropTypes.shape({}),
};

export default memo(StaticPage);
export const StaticPageWithZoomPanPinch = withZoomPanPinchHOC(StaticPage);
