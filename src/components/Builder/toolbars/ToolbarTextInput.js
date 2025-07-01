/* eslint-disable max-len */
import PropTypes from 'prop-types';

const ToolbarTextInput = ({
  onChange, prefix, suffix, value,
}) => {
  const handleChange = e => {
    onChange(e.target.value);
  };
  return (
    <div className="flex border radius outline-2 outline-offset-0 hover:duration-300 focus:duration-300 duration-all-colors color-navy-700 bg-white hover:shadow-xs border-navy-100 focus-within:border-blue-500 outline-transparent hover:border-navy-300 focus-within:outline-blue-200 focus-within:outline-opacity-50 magnet-input-container h-10">
      <span className="flex shrink-0 items-center gap-3 text-sm radius-l color-navy-300 pl-3">{prefix}</span>
      <input
        className="appearance-none bg-transparent grow-1 outline-0 w-full focus-visible-none border-0 text-sm radius placeholder-navy-200 magnet-input h-full color-current px-3"
        onChange={handleChange}
        value={value}
      />
      <span className="flex shrink-0 items-center gap-3 text-sm radius-r color-navy-300 pr-3">{suffix}</span>
    </div>
  );
};

export default ToolbarTextInput;

ToolbarTextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
