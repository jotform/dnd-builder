import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { useTranslatedTexts } from '../utils/hooks';
import { exclamationIcon as ExclamationIcon } from '../utils/icons';

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
        onClick={event => event.stopPropagation()}
        role="presentation"
        style={{
          background: '#fff',
          borderRadius: 8,
          color: '#2c3e50',
          maxHeight: '80vh',
          maxWidth: 720,
          overflow: 'auto',
          padding: 20,
          width: '90%',
        }}
      >
        <div className="errorBoundary-details-header">
          <strong>Error Details</strong>
          <button
            onClick={handleCloseDetails}
            type="button"
          >
            Close
          </button>
        </div>
        <div
          className="errorBoundary-details-content"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {error && error.toString()}
          {errorInfo && errorInfo?.componentStack}
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

const ErrorFallback = ({
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
        className="errorBoundary-icon"
      />
      <strong>{title}</strong>
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

ErrorFallback.propTypes = {
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

ErrorFallback.defaultProps = {
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

function ErrorBoundary({
  children, isStatic, item, level,
}) {
  const [errorInfo, setErrorInfo] = useState(null);
  const {
    ERROR_BOUNDARY_DESCRIPTION, ERROR_BOUNDARY_ITEM_DESCRIPTION, ERROR_BOUNDARY_PAGE_DESCRIPTION, ERROR_BOUNDARY_TITLE,
  } = useTranslatedTexts();

  const TEXT_CONFIG = {
    item: {
      description: ERROR_BOUNDARY_ITEM_DESCRIPTION,
      title: ERROR_BOUNDARY_TITLE,
    },
    page: {
      description: ERROR_BOUNDARY_PAGE_DESCRIPTION,
      title: ERROR_BOUNDARY_TITLE,
    },
    settings: {
      description: ERROR_BOUNDARY_DESCRIPTION,
      title: ERROR_BOUNDARY_TITLE,
    },
  };
  return (
    <ReactErrorBoundary
      fallbackRender={({ error }) => (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          isStatic={isStatic}
          item={item}
          level={level}
          textConfig={TEXT_CONFIG}
        />
      )}
      onError={(error, info) => {
        if (error && info) {
          setErrorInfo(info);
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  isStatic: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string,
    itemType: PropTypes.string,
  }),
  level: PropTypes.oneOf(['item', 'page']),
};

ErrorBoundary.defaultProps = {
  isStatic: false,
  item: null,
  level: 'page',
};

export default ErrorBoundary;
