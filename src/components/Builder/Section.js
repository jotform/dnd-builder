import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIcons } from '../../hooks/useIcons';

const Section = ({
  additionalComponent = null,
  children = null,
  icon = '',
  title = '',
}) => {
  const icons = useIcons();
  const Icon = icons[icon] || icons.settings;
  return (
    <>
      <div
        className={classNames(
          'js-toolTitle toolItem toolTitle d-flex a-center t-normal',
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

export default memo(Section);
