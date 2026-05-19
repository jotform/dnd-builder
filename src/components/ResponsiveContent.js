import { memo } from 'react';
import PropTypes from 'prop-types';

const ResponsiveContent = ({ children, height, width }) => {
  return children(width, height);
};

ResponsiveContent.propTypes = {
  children: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default memo(ResponsiveContent);
