import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as icons from '../../utils/icons';

const Section = ({
  additionalComponent, children, icon, title,
}) => {
  const Icon = icons[icon] || icons.settings;
  return (
    <>
      <div
        className={classNames(
          'js-toolTitle toolItem toolTitle d-flex a-center t-medium',
          { hasAdditional: additionalComponent },
        )}
      >
        {icon
        && <span className={`titleIcon iconFor-${icon}`}><Icon className="jfReportSVG" /></span>}
        <span className="titleName js-titleName">
          {title}
        </span>
        {additionalComponent}
      </div>
      {children}
    </>
  );
};

Section.propTypes = {
  additionalComponent: PropTypes.any,
  children: PropTypes.any,
  icon: PropTypes.string,
  title: PropTypes.string,
};

Section.defaultProps = {
  additionalComponent: null,
  children: null,
  icon: '',
  title: '',
};

export default memo(Section);
