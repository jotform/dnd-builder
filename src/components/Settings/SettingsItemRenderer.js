import { memo, Fragment } from 'react';
import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import Settings from './index';

const getItemComponent = settingType => {
  return Settings[settingType] || Fragment;
};

const SettingsItemRenderer = ({
  children = () => {},
  setting = {
    label: '',
    static: false,
    type: '',
    wrapperClass: '',
  },
}) => {
  const { label, wrapperClass } = setting;
  const component = setting.component ? setting.component : getItemComponent(setting.type);

  if (setting.static) { return children(component); }

  const cx = classNames('toolItem', 'toolSection', wrapperClass);
  return (
    <div className={cx}>
      <div className="toolSection-title t-medium js-ItemLabel">
        {label}
      </div>
      {children(component)}
    </div>
  );
};

SettingsItemRenderer.propTypes = {
  children: PropTypes.any,
  setting: PropTypes.shape({
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({}),
    ]),
    label: PropTypes.string,
    static: PropTypes.bool,
    type: PropTypes.string,
    wrapperClass: PropTypes.string,
  }),
};

const areEqual = (prevProps, nextProps) => {
  if (!isEqual(prevProps.settingValue, nextProps.settingValue)) return false;
  return true;
};

export default memo(SettingsItemRenderer, areEqual);
