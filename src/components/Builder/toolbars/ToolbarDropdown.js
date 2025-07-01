/* eslint-disable max-len */
const ToolbarDropdown = () => {
  return (
    <div className="flex border radius outline-2 outline-offset-0 hover:duration-300 focus:duration-300 duration-all-colors color-navy-700 bg-white hover:shadow-xs border-navy-100 focus-within:border-blue-500 outline-transparent hover:border-navy-300 focus-within:outline-blue-200 focus-within:outline-opacity-50 magnet-select-container relative h-8">
      <select className="appearance-none bg-transparent grow-1 outline-0 w-full focus-visible-none border-0 text-sm radius placeholder-navy-200 magnet-select truncate pl-3 pr-11 z-1 relative">
        <option value="heading">Heading</option>
        <option value="paragraph">Paragraph</option>
        <option value="list">List</option>
        <option value="link">Link</option>
        <option value="image">Image</option>
      </select>
      <span className="absolute right-0 top-0 h-full flex shrink-0 items-center gap-3 text-sm radius-r color-navy-300 pr-3">
        <svg
          className="shrink-0 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M7.293 10.293a1 1 0 0 1 1.414 0L12 13.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414Z"
            fillRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
};

export default ToolbarDropdown;
