import {
  createContext, useContext, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { createStore, useStore } from 'zustand';

const fn = () => {};

const propStore = props => {
  // eslint-disable-next-line complexity
  return createStore(set => ({
    acceptedItems: props.acceptedItems || {},
    additionalPageItems: props.additionalPageItems || [],
    disableInteraction: props.disableInteraction || [],
    itemAccessor: props.itemAccessor || fn,
    leftPanelConfig: props.leftPanelConfig || [],
    onAnEventTrigger: props.onAnEventTrigger || (() => {}),
    onItemAdd: props.onItemAdd || fn,
    onItemChange: props.onItemChange || fn,
    onItemMove: props.onItemMove || fn,
    onItemRemove: props.onItemRemove || fn,
    onItemResize: props.onItemResize || fn,
    onItemsMove: props.onItemsMove || fn,
    onPageAdd: props.onPageAdd || fn,
    onPageChange: props.onPageChange || fn,
    onPageDuplicate: props.onPageDuplicate || fn,
    onPageOrdersChange: props.onPageOrdersChange || fn,
    onPageRemove: props.onPageRemove || fn,
    onSelectedItemsChanged: props.onSelectedItemsChanged || fn,
    onSettingChange: props.onSettingChange || fn,
    pages: props.pages || [],
    setAcceptedItems: acceptedItems => { set({ acceptedItems }); },
    setItemAccessor: itemAccessor => { set({ itemAccessor }); },
    setPages: pages => { set({ pages }); },
    setSettings: settings => { set({ settings }); },
    settings: props.settings || {
      reportLayout: 'A4 Landscape',
    },
    theme: props.theme || 'lightMode',
    useExperimentalFeatures: props.useExperimentalFeatures || false,
  }));
};

const PropContext = createContext(null);

export const PropProvider = ({ children, ...props }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = propStore(props);
  }

  const {
    acceptedItems, itemAccessor, pages, settings,
  } = props;

  useEffect(() => {
    const state = storeRef.current.getState();
    if (!pages || isEqual(state.pages, pages)) return;
    state.setPages(pages);
  }, [pages]);

  useEffect(() => {
    const { setItemAccessor } = storeRef.current.getState();
    setItemAccessor(itemAccessor);
  }, [itemAccessor]);

  useEffect(() => {
    const state = storeRef.current.getState();
    if (!acceptedItems || isEqual(state.acceptedItems, acceptedItems)) return;
    state.setAcceptedItems(acceptedItems);
  }, [acceptedItems]);

  useEffect(() => {
    const state = storeRef.current.getState();
    if (!settings || isEqual(state.settings, settings)) return;
    state.setSettings(settings);
  }, [settings]);

  return (
    <PropContext.Provider value={storeRef.current}>
      {children}
    </PropContext.Provider>
  );
};

PropProvider.propTypes = {
  acceptedItems: PropTypes.shape({}),
  children: PropTypes.any,
  itemAccessor: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.object),
  settings: PropTypes.shape({}),
};

export const PropConsumer = PropContext.Consumer;

export const usePropStore = selector => {
  const context = useContext(PropContext);
  if (!context) {
    throw new Error('usePropStore must be used with PropProvider!');
  }
  return useStore(context, selector);
};
