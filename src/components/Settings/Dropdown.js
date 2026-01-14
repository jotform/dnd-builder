import { memo } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  config = { cast: 'string' },
  item = {},
  onItemChange = () => {},
  value = '',
}) => {
  const { options, unit } = config;

  const selectProps = {};
  if (value) {
    selectProps.value = value;
  }

  const onChange = e => {
    const newValue = config.cast && config.cast === 'integer'
      ? parseInt(e.target.value, 10)
      : e.target.value;
    if (newValue !== value) {
      onItemChange(
        { id: item.id },
        { [config.key]: newValue },
      );
    }
  };
  return (
    <div className="toolSection-dropdownWrapper">
      <select
        className="toolSection-dropdown"
        {...selectProps}
        onChange={onChange}
      >
        {options.map(option => {
          const optionValue = option.value ? option.value : option;
          const optionLabel = option.label ? option.label : option;
          return (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
              {unit ? unit : ''}
            </option>
          );
        })}
      </select>
    </div>
  );
};

Dropdown.propTypes = {
  config: PropTypes.shape({
    cast: PropTypes.string,
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
    unit: PropTypes.string,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default memo(Dropdown);
