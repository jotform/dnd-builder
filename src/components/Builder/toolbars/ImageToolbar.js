/* eslint-disable sort-keys */
import PropTypes from 'prop-types';

const ImageToolbar = ({ activePageItem }) => {
  console.log('activePageItem', activePageItem);

  return (
    <div
      className="image-toolbar"
      style={{
        backgroundColor: 'yellow',
        color: 'black',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 auto',
        padding: '10px',
        width: '70%',
        position: 'relative',
        zIndex: 1000,
      }}
    >
      <div>ImageToolbar 1</div>
      <div>ImageToolbar 2</div>
      <div>ImageToolbar 3</div>
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
