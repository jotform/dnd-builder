import PropTypes from 'prop-types';

const TextToolbar = ({ activePageItem }) => {
  console.log('activePageItem', activePageItem);

  return (
    <div
      className="toooolbar"
      style={{
        backgroundColor: 'blue',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 auto',
        padding: '10px',
        width: '70%',
      }}
    >
      <div>TextToolbar 1</div>
      <div>TextToolbar 2</div>
      <div>TextToolbar 3</div>
    </div>
  );
};

TextToolbar.propTypes = {
  activePageItem: PropTypes.shape({}),
};

TextToolbar.defaultProps = {
  activePageItem: {},
};

export default TextToolbar;
