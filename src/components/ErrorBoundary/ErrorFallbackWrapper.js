import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { exclamationIcon as ExclamationIcon } from '../../utils/icons';
import ErrorDetails from './ErrorDetails';

const ErrorFallbackWrapper = ({
  error = null,
  errorInfo = null,
  isStatic = false,
  item = null,
  level = 'page',
  textConfig,
}) => {
  const { description = '', title = '' } = textConfig[level] || textConfig.page || {};
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <div
      className="errorBoundary-wrapper"
    >
      <ExclamationIcon
        className={isStatic ? 'errorBoundary-icon-static' : 'errorBoundary-icon'}
      />
      <strong style={{ fontSize: !isStatic ? '20px' : '12px' }}>{title}</strong>
      {!isStatic && (
        <>
          {item && (
            <span>
              Item:
              {' '}
              {item.itemType || 'unknown'}
              {' '}
              {item.id ? `(${item.id})` : ''}
            </span>
          )}
          <span>{description}</span>
          <button
            className="errorBoundary-view-details-button"
            onClick={handleOpenDetails}
            type="button"
          >
            View
          </button>
          {isDetailsOpen && createPortal(
            <ErrorDetails
              error={error}
              errorInfo={errorInfo}
              handleCloseDetails={handleCloseDetails}
            />,
            document.body,
          )}
        </>
      )}
    </div>
  );
};

ErrorFallbackWrapper.propTypes = {
  error: PropTypes.instanceOf(Error),
  errorInfo: PropTypes.shape({
    componentStack: PropTypes.string,
  }),
  isStatic: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string,
    itemType: PropTypes.string,
  }),
  level: PropTypes.oneOf(['item', 'page']),
  textConfig: PropTypes.shape({
    item: PropTypes.shape({
      description: PropTypes.string,
      title: PropTypes.string,
    }),
    page: PropTypes.shape({
      description: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
};

ErrorFallbackWrapper.defaultProps = {
  error: null,
  errorInfo: null,
  isStatic: false,
  item: null,
  level: 'page',
  textConfig: {
    item: {
      description: '',
      title: '',
    },
    page: {
      description: '',
      title: '',
    },
  },
};

export default ErrorFallbackWrapper;
