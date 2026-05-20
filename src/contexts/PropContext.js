import {
  createContext, useContext, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { createStore, useStore } from 'zustand';

const fn = () => {};

// History management constants
const HISTORY_LIMIT = 50;

// Export for testing
export const createPropStore = props => {
  // eslint-disable-next-line complexity
  return createStore((set, get) => ({
    acceptedItems: props.acceptedItems || {},
    additionalPageItems: props.additionalPageItems || [],
    canRedo: () => get().historyFuture.length > 0,
    canUndo: () => get().historyPast.length > 0,
    clearHistory: () => {
      set({ historyFuture: [], historyPast: [] });
    },
    disableInteraction: props.disableInteraction || [],
    historyFuture: [],
    historyPast: [],
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
    onPageVisibilityChanged: props.onPageVisibilityChanged || fn,
    onRedo: props.onRedo || fn,
    onSelectedItemsChanged: props.onSelectedItemsChanged || fn,
    onSettingChange: props.onSettingChange || fn,
    onUndo: props.onUndo || fn,
    pages: props.pages || [],
    redo: () => {
      const {
        historyFuture, historyPast, onRedo, pages,
      } = get();
      if (historyFuture.length === 0) return false;
      const next = historyFuture[0];
      const newFuture = historyFuture.slice(1);
      const newPast = [...historyPast, JSON.parse(JSON.stringify(pages))];
      set({
        historyFuture: newFuture,
        historyPast: newPast,
        pages: next,
      });
      onRedo(next);
      return true;
    },
    setAcceptedItems: acceptedItems => { set({ acceptedItems }); },
    setItemAccessor: itemAccessor => { set({ itemAccessor }); },
    setPages: pages => { set({ pages }); },
    setPagesWithHistory: newPages => {
      const { historyPast, pages: currentPages } = get();
      const newPast = [...historyPast, JSON.parse(JSON.stringify(currentPages))].slice(-HISTORY_LIMIT);
      set({
        historyFuture: [],
        historyPast: newPast,
        pages: newPages,
      });
    },
    setSettings: settings => { set({ settings }); },
    settings: props.settings || {
      reportLayout: 'A4 Landscape',
    },
    theme: props.theme || 'lightMode',
    undo: () => {
      const {
        historyFuture, historyPast, onUndo, pages,
      } = get();
      if (historyPast.length === 0) return false;
      const previous = historyPast[historyPast.length - 1];
      const newPast = historyPast.slice(0, -1);
      const newFuture = [JSON.parse(JSON.stringify(pages)), ...historyFuture];
      set({
        historyFuture: newFuture,
        historyPast: newPast,
        pages: previous,
      });
      onUndo(previous);
      return true;
    },
    useExperimentalFeatures: props.useExperimentalFeatures || false,
  }));
};

const PropContext = createContext(null);

export const PropProvider = ({ children, ...props }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createPropStore(props);
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
  onRedo: PropTypes.func,
  onUndo: PropTypes.func,
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
