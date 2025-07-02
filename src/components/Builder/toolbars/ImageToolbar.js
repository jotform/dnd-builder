/* eslint-disable sort-keys */
import PropTypes from 'prop-types';
import ToolbarButton from './ToolbarButton';

const ImageToolbar = ({ activePageItem }) => {
  console.log('activePageItem', activePageItem);

  return (
    <div className="mt-4 flex items-center justify-center">
      <div
        className="relative z-4 flex items-center px-3 py-2 bg-white border border-navy-50
      radius-lg"
      >
        <button
          className="w-8 h-8 flex items-center justify-center"
          type="button"
        >
          <div className="w-4 h-4 bg-white radius border border-navy-100" />
        </button>
        <ToolbarButton
          icon="bg-image"
          onClick={console.log('bg image')}
        />
        <ToolbarButton
          icon="bg-scale"
          onClick={console.log('scale')}
        />
      </div>
    </div>
  );
};

ImageToolbar.propTypes = {
  activePageItem: PropTypes.shape({}),
};

ImageToolbar.defaultProps = {
  activePageItem: {},
};

export default ImageToolbar;
