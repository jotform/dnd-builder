import { memo } from 'react';

const ResponsiveContent = ({ children, height, width }) => {
  return children(width, height);
};

export default memo(ResponsiveContent);
