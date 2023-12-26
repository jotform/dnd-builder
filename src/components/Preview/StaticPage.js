import { memo } from 'react';
import PropTypes from 'prop-types';
import * as classNames from '../../constants/classNames';
import ReportItemRenderer from '../Builder/ReportItemRenderer';
import StaticItem from './StaticItem';
import getMergedItem from '../../utils/getMergedItem';
import withZoomPanPinchHOC from '../withZoomPanPinchHOC';

const StaticPage = ({
  acceptedItems,
  additionalPageItems,
  hashCode,
  isThumbnail,
  itemAccessor,
  items,
  style,
}) => (
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
        const mergedItem = getMergedItem(item, acceptedItems);
        return (
          <StaticItem
            key={item.id}
            hashCode={hashCode}
            item={item}
          >
            <ReportItemRenderer
              item={item}
            >
              {ReportItem => (
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
);

StaticPage.propTypes = {
  acceptedItems: PropTypes.shape({}),
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  isThumbnail: PropTypes.bool,
  itemAccessor: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  style: PropTypes.shape({}),
};

StaticPage.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  hashCode: '',
  isThumbnail: false,
  itemAccessor: () => {},
  items: [],
  style: {},
};

export default memo(StaticPage);
export const StaticPageWithZoomPanPinch = withZoomPanPinchHOC(StaticPage);
