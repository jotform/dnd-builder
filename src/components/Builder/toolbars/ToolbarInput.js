/* eslint-disable max-len */
import PropTypes from 'prop-types';

const ToolbarInput = ({ onChange, value }) => {
  return (
    <div className="flex border radius outline-2 outline-offset-0 hover:duration-300 focus:duration-300 duration-all-colors color-navy-700 bg-white hover:shadow-xs border-navy-100 focus-within:border-blue-500 outline-transparent hover:border-navy-300 focus-within:outline-blue-200 focus-within:outline-opacity-50 magnet-input-container h-8 max-w-24 toolbar-input">
      <input
        className="appearance-none bg-transparent grow-1 outline-0 w-full focus-visible-none border-0 text-sm radius placeholder-navy-200 magnet-input h-full color-current px-3"
        onChange={onChange}
        step="1"
        type="number"
        value={value}
      />
      <div className="flex flex-col w-8 radius-r overflow-hidden">
        <button
          aria-label="Step up"
          className="flex shrink-0 grow-1 justify-center items-center color-navy-500 bg-navy-10"
          tabIndex="-1"
          type="button"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M12.707 11.293a1 1 0 0 0-1.414 0l-4 4A1 1 0 0 0 8 17h8a1 1 0 0 0 .707-1.707l-4-4Z"
              fillRule="evenodd"
            />
          </svg>
        </button>
        <button
          aria-label="Step down"
          className="flex shrink-0 grow-1 justify-center items-center color-navy-500 bg-navy-10"
          tabIndex="-1"
          type="button"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M8 11a1 1 0 0 0-.707 1.707l4 4a1 1 0 0 0 1.414 0l2-2 2-2A1 1 0 0 0 16 11H8Z"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

  );
};

ToolbarInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default ToolbarInput;
