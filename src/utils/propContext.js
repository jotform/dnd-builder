/* eslint-disable react/no-unused-state */
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const PropContext = createContext({
  acceptedItems: {},
  onAnEventTrigger: () => {},
  settings: {},
  useExperimentalFeatures: false,
});

export const usePropContext = () => {
  const context = useContext(PropContext);
  if (!context) {
    throw new Error('PropContext must be used with PropProvider!');
  }
  return context;
};

export class PropProvider extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const updates = {};
    const {
      acceptedItems,
      disableInteraction,
      settings,
      useExperimentalFeatures,
    } = prevState;

    if (nextProps.acceptedItems !== acceptedItems) {
      updates.acceptedItems = nextProps.acceptedItems;
    }
    if (nextProps.disableInteraction !== disableInteraction) {
      updates.disableInteraction = nextProps.disableInteraction;
    }
    if (nextProps.settings !== settings) {
      updates.settings = nextProps.settings;
    }
    if (nextProps.useExperimentalFeatures !== useExperimentalFeatures) {
      updates.useExperimentalFeatures = nextProps.useExperimentalFeatures;
    }

    return updates;
  }

  constructor(props) {
    super(props);
    this.state = {
      acceptedItems: props.acceptedItems || {},
      disableInteraction: props.disableInteraction || [],
      onAnEventTrigger: props.onAnEventTrigger || (() => {}),
      settings: props.settings || {},
      useExperimentalFeatures: props.useExperimentalFeatures || false,
    };
  }

  render() {
    const { children = null } = this.props;
    return (
      <PropContext.Provider value={this.state}>
        {children}
      </PropContext.Provider>
    );
  }
}

PropProvider.propTypes = {
  acceptedItems: PropTypes.shape({}),
  children: PropTypes.any,
  disableInteraction: PropTypes.arrayOf(PropTypes.string),
  onAnEventTrigger: PropTypes.func,
  settings: PropTypes.shape({}),
  useExperimentalFeatures: PropTypes.bool,
};

export const PropConsumer = PropContext.Consumer;
