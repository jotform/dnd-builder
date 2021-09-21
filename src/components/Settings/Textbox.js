import { memo } from 'react';
import PropTypes from 'prop-types';

const Textbox = ({
  config,
  item,
  maxLength,
  onItemChange,
  placeholder,
  value,
}) => {
  const onChange = e => {
    const { value: newValue } = e.target;
    if (newValue !== value) {
      const changeSettingsFor = { [config.key]: newValue };
      onItemChange({ id: item.id }, changeSettingsFor);
    }
  };

  const handleKeyDown = e => e.stopPropagation();

  const customProps = {};
  if (maxLength) customProps.maxLength = maxLength;

  return (
    <input
      {...customProps}
      className="toolSection-input"
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder={config.placeholder || placeholder}
      type={config.inputType || 'text'}
      value={value}
    />
  );
};

Textbox.propTypes = {
  config: PropTypes.shape({
    inputType: PropTypes.string,
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
    placeholder: PropTypes.string,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  maxLength: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  onItemChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Textbox.defaultProps = {
  config: [],
  item: {},
  maxLength: false,
  onItemChange: () => {},
  placeholder: '',
  value: '',
};

export default memo(Textbox);
