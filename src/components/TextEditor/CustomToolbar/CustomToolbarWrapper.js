import PropTypes from 'prop-types';
import CustomToolbar from './CustomToolbar';

const CustomToolbarWrapper = ({
  itemWidth = 0,
}) => (
  <div
    id="toolbar"
    style={{
      pointerEvents: 'auto',
      position: 'absolute',
      top: '100%',
    }}
  >
    <CustomToolbar itemWidth={itemWidth} />
  </div>
);

CustomToolbarWrapper.propTypes = {
  itemWidth: PropTypes.number,
};

export default CustomToolbarWrapper;
