import PropTypes from 'prop-types';

const ProgressBar = ({
  currentPage = 1,
  pageCount = 1,
}) => pageCount > 2 && (
  <div
    className="jfPresentation-progressBar"
    style={{
      width: `${(100 / (pageCount - 1)) * (currentPage - 1)}%`,
    }}
  />
);

ProgressBar.propTypes = {
  currentPage: PropTypes.number,
  pageCount: PropTypes.number,
};

export default ProgressBar;
