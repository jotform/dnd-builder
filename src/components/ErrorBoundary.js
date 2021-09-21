import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorInfo: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo: errorInfo.componentStack });
  }

  render() {
    const { children } = this.props;
    const { errorInfo, hasError } = this.state;
    if (hasError) {
      return (
        <>
          <div>Something went wrong.</div>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {hasError && hasError.toString()}
            {errorInfo}
          </details>
        </>
      );
    }
    return children;
  }
}

ErrorBoundry.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ErrorBoundry;
