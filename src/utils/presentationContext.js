/* eslint-disable react/no-unused-state */
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const PresentationContext = createContext({
  currentPage: 1,
  fittedZoom: 1,
  isFullscreen: false,
  pageCount: 0,
  showZoomInFullScreen: false,
});

export const usePresentationContext = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('PresentationContext must be used with PresentationProvider!');
  }
  return context;
};

export class PresentationProvider extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const updates = {};
    const {
      pageCount,
    } = prevState;

    if (nextProps.pageCount !== pageCount) {
      updates.pageCount = nextProps.pageCount;
    }

    return updates;
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.currentPage || 1,
      isFullscreen: props.isFullscreen || false,
      pageCount: props.pageCount || 1,
      setCurrentPage: this.setCurrentPage,
      setFittedZoom: this.setFittedZoom,
      setIsFullscreen: this.setIsFullscreen,
      setShowControlsInFullScreen: this.setShowControlsInFullScreen,
    };
  }

  setCurrentPage = currentPage => {
    this.setState({ currentPage });
  };

  setIsFullscreen = isFullscreen => {
    this.setState({ isFullscreen, showControlsInFullScreen: false });
  };

  setShowControlsInFullScreen = showControlsInFullScreen => {
    this.setState({ showControlsInFullScreen });
  }

  setFittedZoom = fittedZoom => {
    this.setState({ fittedZoom });
  }

  render() {
    const { children = null } = this.props;
    return (
      <PresentationContext.Provider value={this.state}>
        {children}
      </PresentationContext.Provider>
    );
  }
}

PresentationProvider.propTypes = {
  children: PropTypes.any,
  currentPage: PropTypes.number,
  isFullscreen: PropTypes.bool,
  pageCount: PropTypes.number,
};

export const PresentationConsumer = PresentationContext.Consumer;
