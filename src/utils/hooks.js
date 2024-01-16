import {
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { zoomHandler } from './functions';
import { SharingTextsModule } from '../constants/texts';

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

export const useFitZoom = ({
  handler,
  isModeCustomize,
  settings,
}) => {
  useEffect(() => {
    zoomHandler({
      handler,
      isModeCustomize,
      limitZoom: true,
      onLoad: true, // while page is loading, some conditions should be not working in handler
      settings,
    });
  }, [settings.reportLayout]);
};

export const usePageVisibility = (callback, pageCount, selectedPageIndex) => {
  const ratio = useRef({});
  const pageRefs = useRef([]);
  const observer = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      const order = entry.target.getAttribute('data-order');
      if (entry.intersectionRatio !== 0) {
        ratio.current[order] = entry.intersectionRatio;
      } else {
        delete ratio.current[order];
      }
    });
    callback(parseInt(
      Object.keys(ratio.current)
        .find(key => ratio.current[key] === Math.max(...Object.values(ratio.current))),
      10,
    ));
  },
  {
    delay: 100,
    root: document.querySelector('.jfReport-viewport'),
    threshold: [0, 0.5, 1],
  });

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
  }, [selectedPageIndex]);
};

export const useFullscreenChange = (isFullscreen, setIsFullscreen, fitToScreen) => {
  /**
   * All this is just to cover if the user exits fullscreen via ESC key :(
  */
  const onFullscreenChange = () => {
    if (!(
      document.fullScreen
      || document.mozFullScreen
      || document.webkitIsFullScreen
    )) {
      if (isFullscreen) {
        setIsFullscreen(false);
        fitToScreen(600);
      }
    }
  };

  useEventListener('fullscreenchange', onFullscreenChange);
  useEventListener('webkitfullscreenchange', onFullscreenChange);
  useEventListener('mozfullscreenchange', onFullscreenChange);
  useEventListener('MSFullscreenChange', onFullscreenChange);
};

export const useTranslatedTexts = () => {
  return useMemo(() => SharingTextsModule.Texts, [SharingTextsModule.Texts]);
};

export const useClickOutsideListener = (classes, conditionValue, onClose) => {
  const onClickOutsideForPanel = ({ target: { classList } }) => {
    const shouldClose = classes.some(c => classList.contains(c));
    if (shouldClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (conditionValue) window.addEventListener('click', onClickOutsideForPanel, false);
    return () => window.removeEventListener('click', onClickOutsideForPanel, false);
  }, [conditionValue]);
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
