import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Switch = ({
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

Switch.propTypes = {
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

Switch.defaultProps = {
  config: {},
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(Switch);
