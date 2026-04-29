/* eslint-disable complexity */
import {
  createContext,
  useContext,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { createStore, useStore } from 'zustand';
import { SLIDES_LIST_TYPE_MAP } from '../constants/panel';

const builderStore = props => {
  return createStore((set, get) => ({
    activeElements: props.activeElement || [],
    activeTab: props.activeTab || { left: 0, right: 0 },
    clickOutsideIgnoreSelectors: props.clickOutsideIgnoreSelectors || [],
    contextMenuProps: props.contextMenuProps || false,
    editedElement: props.editedElement || 'l_layout',
    guides: {},
    isLeftPanelOpen: props.isLeftPanelOpen || false,
    isResize: false,
    isRightPanelOpen: props.isRightPanelOpen || false,
    isSlidesNavigatorOpen: props.isSlidesNavigatorOpen || false,
    isSlidesPanelOpen: props.isSlidesPanelOpen || false,
    isTextEditorOpen: props.isTextEditorOpen || false,
    lastScrollPosition: props.lastScrollPosition || 0,
    matches: {},
    onRightPanelsToggled: props.onRightPanelsToggled || (() => {}),
    overedPageId: props.activePageId || null,
    resetActiveElements: props.resetActiveElements || (() => {
      set({ activeElements: [], editedElement: 'l_layout' });
    }),
    restoreLeftPanelWhenNavigatorCloses: false,
    restoreSlidesNavigatorWhenLeftCloses: false,
    setActiveElements: props.setActiveElements || ((itemID, edit = true, replace = true) => {
      const { activeElements } = get();
      set({
        activeElements: replace ? [itemID] : [...activeElements, itemID],
        ...edit ? { editedElement: !itemID ? 'l_layout' : `i_${itemID}` } : {},
      });
    }),
    setActiveElementsSelection: props.setActiveElementsSelection || (itemIDs => {
      if (!itemIDs || itemIDs.length === 0) {
        set({ activeElements: [], editedElement: 'l_layout' });
      } else if (itemIDs.length === 1) {
        set({
          activeElements: itemIDs,
          editedElement: `i_${itemIDs[0]}`,
        });
      } else {
        set({ activeElements: itemIDs });
      }
    }),
    setActiveTab: props.setActiveTab || ((panel, tabIndex) => {
      const { activeTab } = get();
      set({ activeTab: { ...activeTab, [panel]: tabIndex } });
    }),
    setContextMenuProps: status => {
      set({ contextMenuProps: status });
    },
    setEditedElement: id => {
      set({ editedElement: id });
    },
    setGuides: guides => {
      set({ guides });
    },
    setIsLeftPanelOpen: props.setIsLeftPanelOpen || (status => {
      const {
        isEnoughCanvasSize,
        isSlidesNavigatorOpen: previousIsSlidesNavigatorOpen,
        restoreSlidesNavigatorWhenLeftCloses,
      } = get();

      if (status) {
        if (previousIsSlidesNavigatorOpen) {
          set({
            isLeftPanelOpen: true,
            isSlidesNavigatorOpen: false,
            restoreLeftPanelWhenNavigatorCloses: false,
            restoreSlidesNavigatorWhenLeftCloses: true,
            ...!isEnoughCanvasSize && { isRightPanelOpen: false },
          });
        } else {
          set({
            isLeftPanelOpen: true,
            restoreLeftPanelWhenNavigatorCloses: false,
            restoreSlidesNavigatorWhenLeftCloses: false,
            ...!isEnoughCanvasSize && { isRightPanelOpen: false },
          });
        }
        return;
      }

      if (restoreSlidesNavigatorWhenLeftCloses) {
        set({
          isLeftPanelOpen: false,
          isSlidesNavigatorOpen: true,
          restoreSlidesNavigatorWhenLeftCloses: false,
        });
        return;
      }

      set({ isLeftPanelOpen: false });
    }),
    setIsResize: status => {
      set({ isResize: status });
    },
    setIsRightPanelOpen: props.setIsRightPanelOpen || (status => {
      const { isEnoughCanvasSize, onRightPanelsToggled } = get();
      set({
        isRightPanelOpen: status,
        ...status && !isEnoughCanvasSize && {
          isLeftPanelOpen: false,
          restoreLeftPanelWhenNavigatorCloses: false,
          restoreSlidesNavigatorWhenLeftCloses: false,
        },
        ...status && { isSlidesPanelOpen: false },
      });
      onRightPanelsToggled(status);
    }),
    setIsSlidesNavigatorOpen: status => {
      const {
        isLeftPanelOpen: previousIsLeftPanelOpen,
        restoreLeftPanelWhenNavigatorCloses,
      } = get();

      if (status) {
        if (previousIsLeftPanelOpen) {
          set({
            isLeftPanelOpen: false,
            isSlidesNavigatorOpen: true,
            restoreLeftPanelWhenNavigatorCloses: true,
            restoreSlidesNavigatorWhenLeftCloses: false,
          });
        } else {
          set({
            isSlidesNavigatorOpen: true,
            restoreLeftPanelWhenNavigatorCloses: false,
            restoreSlidesNavigatorWhenLeftCloses: false,
          });
        }
        return;
      }

      if (restoreLeftPanelWhenNavigatorCloses) {
        set({
          isLeftPanelOpen: true,
          isSlidesNavigatorOpen: false,
          restoreLeftPanelWhenNavigatorCloses: false,
        });
        return;
      }

      set({
        isSlidesNavigatorOpen: false,
        restoreSlidesNavigatorWhenLeftCloses: false,
      });
    },
    setIsSlidesPanelOpen: props.setIsSlidesPanelOpen || (status => {
      const { isEnoughCanvasSize, onRightPanelsToggled } = get();
      set({
        isSlidesPanelOpen: status,
        ...status && !isEnoughCanvasSize && {
          isLeftPanelOpen: false,
          restoreLeftPanelWhenNavigatorCloses: false,
          restoreSlidesNavigatorWhenLeftCloses: false,
        },
        ...status && { isRightPanelOpen: false },
      });
      onRightPanelsToggled(status);
    }),
    setIsTextEditorOpen: status => {
      set({ isTextEditorOpen: status });
    },
    setMatches: matches => {
      set({ matches });
    },
    setOutPage: outPageId => {
      set({ overedPageId: outPageId });
    },
    setOverPage: overPageId => {
      set({ overedPageId: overPageId });
    },
    setToolbarPosition: ({ itemId, position }) => {
      set({ toolbarPosition: { itemId, position } });
    },
    setVisiblePageOrder: visiblePageOrder => {
      set({ visiblePageOrder });
    },
    setZoom: (zoom, layoutWidth) => {
      set({ zoom });
      if (layoutWidth && get().mode === 'customize') {
        const { clientWidth: paneWidth } = document.querySelector('.jfReport-pane .toolItemWrapper');
        const sceneWidth = parseInt(layoutWidth, 10) * zoom;
        if (window.innerWidth - sceneWidth + 100 > (paneWidth * 2)) {
          set({ isEnoughCanvasSize: true });
        } else {
          set({
            isEnoughCanvasSize: false,
            isLeftPanelOpen: false,
            restoreLeftPanelWhenNavigatorCloses: false,
            restoreSlidesNavigatorWhenLeftCloses: false,
          });
        }
      }
    },
    shouldFitZoomInitially: !!props.defaultZoom,
    shouldShowRightPanelInitially: props.shouldShowRightPanelInitially ?? true,
    slidesListType: props.slidesListType || SLIDES_LIST_TYPE_MAP.PANEL,
    toolbarPosition: props.toolbarPosition || { itemId: '', position: 'right-align' },
    visiblePageOrder: 1,
    zoom: props.defaultZoom ?? 0.8,
  }));
};

const BuilderContext = createContext(null);

export const BuilderProvider = ({
  activeElement, children, value, ...props
}) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = builderStore(props);
  }

  useEffect(() => {
    const state = storeRef.current.getState();
    if (!activeElement.length || isEqual(state.activeElements, activeElement)) return;
    state.setActiveElementsSelection(activeElement);
  }, [activeElement]);

  return (
    <BuilderContext.Provider value={storeRef.current}>
      {children}
    </BuilderContext.Provider>
  );
};

BuilderProvider.propTypes = {
  activeElement: PropTypes.array,
  children: PropTypes.any,
  value: PropTypes.object,
};

export const BuilderConsumer = BuilderContext.Consumer;

export const useBuilderStore = selector => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilderStore must be used with BuilderProvider!');
  }
  return useStore(context, selector);
};
