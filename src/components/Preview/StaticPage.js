import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import * as classNames from '../../constants/classNames';
import ReportItemRenderer from '../Builder/ReportItemRenderer';
import StaticItem from './StaticItem';
import getMergedItem from '../../utils/getMergedItem';
import withZoomPanPinchHOC from '../withZoomPanPinchHOC';

const StaticPage = ({
  acceptedItems,
  additionalPageItems,
  hashCode,
  itemAccessor,
  items,
  mode,
  style,
}) => {
  const reportClasses = cn('jfReport-hider f-all p-relative',
    mode === 'responsive' ? 'layout-responsive' : 'o-hidden');
  return (
    <div
      className={classNames.pageContainer}
      style={style}
    >
      <div className={reportClasses}>
        {items.filter(item => (
          item.isVisible !== undefined
            ? item.isVisible
            : true
        )).map(item => {
          const mergedItem = getMergedItem(item, acceptedItems);
          return (
            <StaticItem
              key={item.id}
              containerStyle={style}
              hashCode={hashCode}
              item={item}
              mode={mode}
            >
              <ReportItemRenderer
                item={item}
              >
                {ReportItem => (
                  <ReportItem
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
};

StaticPage.propTypes = {
  acceptedItems: PropTypes.shape({}),
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  mode: PropTypes.string,
  style: PropTypes.shape({}),
};

StaticPage.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  hashCode: '',
  itemAccessor: () => { },
  items: [],
  mode: 'customize',
  style: {},
};

export default memo(StaticPage);
export const StaticPageWithZoomPanPinch = withZoomPanPinchHOC(StaticPage);
