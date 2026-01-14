import { memo } from 'react';
import PropTypes from 'prop-types';

const ItemPositioner = ({
  children = null,
  classNames = '',
  style = {},
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

export default memo(ItemPositioner);
