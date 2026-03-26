import { memo } from 'react';
import PropTypes from 'prop-types';

const ItemPositioner = ({
  children = null,
  classNames = '',
  dataItemId,
  style = {},
}) => {
  return (
    <div
      className={classNames}
      data-item-id={dataItemId}
      style={style}
    >
      {children}
    </div>
  );
};

ItemPositioner.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string,
  dataItemId: PropTypes.string,
  style: PropTypes.shape({}),
};

export default memo(ItemPositioner);
