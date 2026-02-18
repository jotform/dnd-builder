import PropTypes from 'prop-types';
import CrossIcon from '../../assets/svg/close.svg';

const ErrorDetails = ({
  error = null,
  errorInfo = null,
  handleCloseDetails = () => {},
}) => {
  return (
    <div
      className="errorBoundary-details-overlay"
      onClick={handleCloseDetails}
      role="presentation"
    >
      <div
        className="errorBoundary-details-wrapper"
        onClick={e => e.stopPropagation()}
        role="presentation"
      >
        <div className="errorBoundary-details-header">
          <div style={{ marginRight: '24px', minWidth: '0' }}>
            <h2>Error Details</h2>
            <p
              style={{
                color: '#6C73A8',
                fontSize: '14px',
                lineHeight: '20px',
                marginTop: '8px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {error && error.toString()}
            </p>
          </div>
          <button
            aria-label="Close Button"
            className="errorBoundary-details-close-button"
            onClick={handleCloseDetails}
            type="button"
          >
            <CrossIcon style={{ height: '24px', width: '24px' }} />
          </button>
        </div>
        <div
          className="errorBoundary-details-content"
        >
          <div className="errorBoundary-details-content-inner">
            {error && error.toString()}
            {errorInfo && errorInfo?.componentStack}
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorDetails.propTypes = {
  error: PropTypes.instanceOf(Error),
  errorInfo: PropTypes.shape({
    componentStack: PropTypes.string,
  }),
  handleCloseDetails: PropTypes.func,
};

export default ErrorDetails;
