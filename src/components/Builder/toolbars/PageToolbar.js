import PropTypes from 'prop-types';
import ToolbarButton from './ToolbarButton';

const PageToolbar = ({ page }) => {
  console.log('page', page);

  return (
    <div className="mt-4 flex items-center justify-center">
      <div
        className="relative z-4 flex items-center px-3 py-2 bg-white border border-navy-50
    radius"
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
        <ToolbarButton
          icon="duplicate"
          onClick={console.log('scale')}
        />
        <ToolbarButton
          icon="plus"
          onClick={console.log('scale')}
        />
      </div>
    </div>
  );
};

PageToolbar.propTypes = {
  page: PropTypes.shape({}),
};

PageToolbar.defaultProps = {
  page: {},
};

export default PageToolbar;
