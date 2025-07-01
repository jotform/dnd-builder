import PropTypes from 'prop-types';

const PageToolbar = ({ page }) => {
  console.log('page', page);

  return (
    <div
      className="page-toolbar"
      style={{
        backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 auto',
        padding: '10px',
        width: '70%',
      }}
    >
      <div>PageToolbar 1</div>
      <div>PageToolbar 2</div>
      <div>PageToolbar 3</div>
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
