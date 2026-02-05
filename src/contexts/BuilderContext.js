import { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { createStore, useStore } from 'zustand';

const builderStore = props => {
  return createStore((set, get) => ({
    activeElements: props.activeElement || [],
    activeTab: props.activeTab || { left: 0, right: 0 },
    contextMenuProps: props.contextMenuProps || false,
    editedElement: props.editedElement || 'l_layout',
    guides: {},
    matches: {},
    isAllSlidesPanelOpen: props.isAllSlidesPanelOpen || false,
    isLeftPanelOpen: props.isLeftPanelOpen || false,
    isResize: false,
    isRightPanelOpen: props.isRightPanelOpen || false,
    isSlidesPanelOpen: props.isSlidesPanelOpen || false,
    isTextEditorOpen: props.isTextEditorOpen || false,
    lastScrollPosition: props.lastScrollPosition || 0,
    onRightPanelsToggled: props.onRightPanelsToggled || (() => {}),
    resetActiveElements: props.resetActiveElements || (() => {
      set({ activeElements: [], editedElement: 'l_layout' });
    }),
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
    setMatches: matches => {
      set({ matches });
    },
    setIsAllSlidesPanelOpen: status => {
      set({ isAllSlidesPanelOpen: status });
    },
    setIsLeftPanelOpen: props.setIsLeftPanelOpen || (status => {
      const { isEnoughCanvasSize } = get();
      set({
        isLeftPanelOpen: status,
        ...status && !isEnoughCanvasSize && { isRightPanelOpen: false },
      });
    }),
    setIsResize: status => {
      set({ isResize: status });
    },
    setIsRightPanelOpen: props.setIsRightPanelOpen || (status => {
      const { isEnoughCanvasSize, onRightPanelsToggled } = get();
      set({
        isRightPanelOpen: status,
        ...status && !isEnoughCanvasSize && { isLeftPanelOpen: false },
        ...status && { isSlidesPanelOpen: false },
      });
      onRightPanelsToggled(status);
    }),
    setIsSlidesPanelOpen: props.setIsSlidesPanelOpen || (status => {
      const { isEnoughCanvasSize, onRightPanelsToggled } = get();
      set({
        isSlidesPanelOpen: status,
        ...status && !isEnoughCanvasSize && { isLeftPanelOpen: false },
        ...status && { isRightPanelOpen: false },
      });
      onRightPanelsToggled(status);
    }),
    setIsTextEditorOpen: status => {
      set({ isTextEditorOpen: status });
    },
    setZoom: (zoom, layoutWidth) => {
      set({ zoom });
      if (layoutWidth) {
        const { clientWidth: paneWidth } = document.querySelector('.jfReport-pane .toolItemWrapper');
        const sceneWidth = parseInt(layoutWidth, 10) * zoom;
        if (window.innerWidth - sceneWidth + 100 > (paneWidth * 2)) {
          set({ isEnoughCanvasSize: true });
        } else {
          set({
            isEnoughCanvasSize: false,
            isLeftPanelOpen: false,
          });
        }
      }
    },
    zoom: 1,
  }));
};

const BuilderContext = createContext(null);

export const BuilderProvider = ({ children, value, ...props }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = builderStore(props);
  }

  return (
    <BuilderContext.Provider value={storeRef.current}>
      {children}
    </BuilderContext.Provider>
  );
};

BuilderProvider.propTypes = {
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
