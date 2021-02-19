import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Toggle = ({
  config,
  item,
  onItemChange,
  value,
}) => {
  const onChange = e => {
    const status = e.target.checked ? 'on' : 'off';
    onItemChange(
      { id: item.id },
      { [config.key]: status },
    );
  };
  return (
    <label
      className={classNames(
        'toolToggle',
        { toggled: value === 'on' },
      )}
      htmlFor={config.key}
    >
      <input
        checked={value === 'on'}
        className="toolToggle-input"
        id={config.key}
        onChange={onChange}
        type="checkbox"
      />
      <span className="toolToggle-custom" />
    </label>
  );
};

Toggle.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

Toggle.defaultProps = {
  config: {},
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(Toggle);
