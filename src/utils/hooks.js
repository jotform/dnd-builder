import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { getZoomValue } from './functions';
import { SharingTextsModule } from '../constants/texts';
import { usePropStore } from '../contexts/PropContext';
import { useBuilderStore } from '../contexts/BuilderContext';
import { usePresentationStore } from '../contexts/PresentationContext';

export const useStateWithCallback = (initialState, callback) => {
  const [state, setState] = useState(initialState);

  useEffect(() => callback(state), [state, callback]);

  return [state, setState];
};

export const useEventListener = (eventName, handler, element = global) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventListener = event => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element],
  );
};

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const usePropState = (propValue, transform = v => v) => {
  const [state, setState] = useState(() => transform(propValue));

  useEffect(() => {
    setState(transform(propValue));
  }, [propValue, transform]);

  return [state, setState];
};

export const useFitZoom = () => {
  const settings = usePropStore(state => state.settings);
  const setZoom = useBuilderStore(state => state.setZoom);

  useEffect(() => {
    const newZoom = getZoomValue({
      limitZoom: true,
      settings: {
        reportLayoutHeight: settings.reportLayoutHeight,
        reportLayoutWidth: settings.reportLayoutWidth,
      },
    });
    setZoom(newZoom, settings.reportLayoutWidth);
  }, [
    settings.reportLayoutHeight,
    settings.reportLayoutWidth,
    setZoom,
  ]);
};

export const usePageVisibility = (callback, pageCount, selectedPageIndex) => {
  const ratio = useRef({});
  const prevVisiblePageIndex = useRef(-1);
  const pageRefs = useRef([]);
  const observer = useMemo(() => new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      const order = entry.target.getAttribute('data-order');
      if (entry.intersectionRatio !== 0) {
        ratio.current[order] = entry.intersectionRatio;
      } else {
        delete ratio.current[order];
      }
    });
    const visiblePageIndex = parseInt(
      Object.keys(ratio.current)
        .find(key => ratio.current[key] === Math.max(...Object.values(ratio.current))),
      10,
    );
    if (visiblePageIndex !== prevVisiblePageIndex.current) {
      prevVisiblePageIndex.current = visiblePageIndex;
      callback(visiblePageIndex);
    }
  },
  {
    delay: 100,
    root: document.querySelector('.jfReport-viewport'),
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }), [callback]);

  useEffect(() => {
    ratio.current = {};
    pageRefs.current = document.querySelectorAll('.jfReport-page');
  }, [pageCount]);

  useEffect(() => {
    if (selectedPageIndex === -1) {
      pageRefs.current.forEach(page => {
        observer.observe(page);
      });
    }

    return () => {
      pageRefs.current.forEach(page => {
        observer.unobserve(page);
      });
    };
  }, [selectedPageIndex, observer]);
};

export const useFullscreenChange = (isFullscreen, fitToScreen) => {
  /**
   * All this is just to cover if the user exits fullscreen via ESC key :(
  */
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const setIsFullscreen = usePresentationStore(state => state.setIsFullscreen);

  const onFullscreenChange = useCallback(() => {
    if (!(
      document.fullScreen
      || document.mozFullScreen
      || document.webkitIsFullScreen
    )) {
      onAnEventTrigger('clickedFullscreen');
      setIsFullscreen(false);
      fitToScreen(500);
    } else {
      setIsFullscreen(true);
      fitToScreen(600);
    }
  }, [fitToScreen, setIsFullscreen, onAnEventTrigger]);

  useEventListener('fullscreenchange', onFullscreenChange);
  useEventListener('webkitfullscreenchange', onFullscreenChange);
  useEventListener('mozfullscreenchange', onFullscreenChange);
  useEventListener('MSFullscreenChange', onFullscreenChange);
};

export const useTranslatedTexts = () => {
  return useMemo(() => SharingTextsModule.Texts, []);
};

export const useClickOutsideListener = (classes, conditionValue, onClose) => {
  const onClickOutsideForPanel = useCallback(({ target: { classList } }) => {
    const shouldClose = classes.some(c => classList.contains(c));
    if (shouldClose) {
      onClose();
    }
  }, [classes, onClose]);

  useEffect(() => {
    if (conditionValue) window.addEventListener('click', onClickOutsideForPanel, false);
    return () => window.removeEventListener('click', onClickOutsideForPanel, false);
  }, [conditionValue, onClickOutsideForPanel]);
};

export const usePageTransition = (style, currentPage) => {
  const finalStyle = useMemo(() => {
    switch (style) {
    case 'verticalSlide':
      return { transform: `translateY(-${(currentPage * 100).toString()}%)` };
    case 'scaleAndFade':
      return {};
    case 'rotate':
      return { '-webkit-perspective': 1000 };
    case 'scaleAndSlide':
    case 'horizontalSlide':
    default:
      return { transform: `translateX(-${(currentPage * 100).toString()}%)` };
    }
  }, [style, currentPage]);

  return finalStyle;
};

export const useSelectedElements = () => {
  const pages = usePropStore(state => state.pages);
  const activeElements = useBuilderStore(state => state.activeElements);
  const acceptedItems = usePropStore(state => state.acceptedItems);

  return useMemo(() => {
    if (activeElements.length === 0) return [];
    const items = activeElements.map(itemID => {
      let foundItem = [];
      pages.forEach(page => {
        const item = page.items.find(el => el.id === itemID);
        if (item) {
          foundItem = item;
        }
      });
      const defItem = (acceptedItems[foundItem.itemType] && acceptedItems[foundItem.itemType].defaultItem) || {};
      return { ...defItem, ...foundItem };
    });
    return items;
  }, [pages, activeElements, acceptedItems]);
};
