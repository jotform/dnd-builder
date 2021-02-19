import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';

const Button = ({
  classNames,
  icon,
  onClick,
  title,
}) => {
  const Icon = icons[icon] || icons.settings;

  return (
    <button
      className={classNames}
      onClick={onClick}
      type="button"
    >
      {icon && <Icon className={`jfReportSVG icon-${icon}`} />}
      <span>{title}</span>
    </button>
  );
};

Button.propTypes = {
  classNames: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.any,
  title: PropTypes.any,
};

Button.defaultProps = {
  classNames: '',
  icon: '',
  onClick: '',
  title: '',
};

export default memo(Button);
