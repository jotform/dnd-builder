import { throttle } from './functions';

const OFFSET = 50; // This is the top/bottom offset you use to start scrolling in the div.
const PX_DIFF = 6;

let scrollIncrement = 0;
let isScrolling = false;
let sidebarElement = null;
let scrollHeightSidebar = 0;
let clientRectBottom = 0;
let clientRectTop = 0;

// Scroll up in the sidebar.
const goUp = () => {
  scrollIncrement -= PX_DIFF;
  sidebarElement.scrollTop = scrollIncrement;

  if (isScrolling && scrollIncrement >= 0) {
    window.requestAnimationFrame(goUp);
  }
};

// Scroll down in the sidebar.
const goDown = () => {
  scrollIncrement += PX_DIFF;
  sidebarElement.scrollTop = scrollIncrement;

  if (isScrolling && scrollIncrement <= scrollHeightSidebar) {
    window.requestAnimationFrame(goDown);
  }
};

const onDragOver = event => {
  const isMouseOnTop = scrollIncrement >= 0
    && event.clientY > clientRectTop
    && event.clientY < clientRectTop + OFFSET;
  const isMouseOnBottom = scrollIncrement <= scrollHeightSidebar
    && event.clientY > clientRectBottom - OFFSET
    && event.clientY <= clientRectBottom;

  if (!isScrolling && (isMouseOnTop || isMouseOnBottom)) {
    isScrolling = true;
    scrollIncrement = sidebarElement.scrollTop;

    if (isMouseOnTop) {
      window.requestAnimationFrame(goUp);
    } else {
      window.requestAnimationFrame(goDown);
    }
  } else if (!isMouseOnTop && !isMouseOnBottom) {
    isScrolling = false;
  }
};

const throttleOnDragOver = throttle(onDragOver, 200);

const addEventListenerForSidebar = () => {
  sidebarElement = document.querySelector('.jfReport-viewport');
  scrollHeightSidebar = sidebarElement.scrollHeight;
  const clientRect = sidebarElement.getBoundingClientRect();
  clientRectTop = clientRect.top;
  clientRectBottom = clientRect.bottom;

  sidebarElement.addEventListener('dragover', throttleOnDragOver);
};

const removeEventListenerForSidebar = () => {
  isScrolling = false;

  if (sidebarElement) {
    sidebarElement.removeEventListener('dragover', throttleOnDragOver);
  }
};

export { addEventListenerForSidebar, removeEventListenerForSidebar };
