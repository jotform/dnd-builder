import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import * as classNames from '../../constants/classNames';
import { getStyles } from '../../utils/functions';
import ItemPositioner from '../ItemPositioner';
import ErrorBoundary from '../ErrorBoundary';

const elementStyle = {
  height: '100%',
  width: '100%',
};

const StaticItem = ({
  children = null,
  item = {},
}) => {
  const {
    height,
    left,
    top,
    width,
  } = item;
  return (
    <ErrorBoundary>
      <ItemPositioner
        style={{
          ...getStyles(left, top, false),
          height,
          width,
        }}
      >
        <div
          className={classNames.reportItemWrapper}
        >
          <div
            className={cn(
              `${classNames.reportItem}`,
              { hasChart: item.itemType === 'chart' },
            )}
            style={elementStyle}
          >
            {children}
          </div>
        </div>
      </ItemPositioner>
    </ErrorBoundary>
  );
};

StaticItem.propTypes = {
  children: PropTypes.any,
  item: PropTypes.shape({
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    id: PropTypes.string,
    itemType: PropTypes.string,
    left: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    pageID: PropTypes.string,
    top: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
};

export default memo(StaticItem);
