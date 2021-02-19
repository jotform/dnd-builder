import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ItemPositioner = ({
  children,
  classNames,
  style,
}) => {
  return (
    <div
      className={classNames}
      style={style}
    >
      {children}
    </div>
  );
};

ItemPositioner.propTypes = {
  children: PropTypes.any,
  classNames: PropTypes.string,
  style: PropTypes.shape({}),
};

ItemPositioner.defaultProps = {
  children: null,
  classNames: '',
  style: {},
};

export default memo(ItemPositioner);
