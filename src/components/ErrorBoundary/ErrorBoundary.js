import { useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { useTranslatedTexts } from '../../utils/hooks';
import ErrorFallbackWrapper from './ErrorFallbackWrapper';

function ErrorBoundary({
  children, isStatic, item, level,
}) {
  const [errorInfo, setErrorInfo] = useState(null);
  const {
    ERROR_BOUNDARY_DESCRIPTION,
    ERROR_BOUNDARY_ITEM_DESCRIPTION,
    ERROR_BOUNDARY_PAGE_DESCRIPTION,
    ERROR_BOUNDARY_TITLE,
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
        <ErrorFallbackWrapper
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
