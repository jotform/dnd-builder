import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useBuilderStore } from '../contexts/BuilderContext';
import { usePropStore } from '../contexts/PropContext';
import { getItemsInSelectionBox } from './functions';

const EXCLUDED_SELECTORS = [
  '.reportItem',
  '.reportItemWrapper',
  '.pageActions',
  '.jfReport-addSlide',
  '[role="button"]',
  'button',
  '.contextMenu',
  '.reportItemResizer-wrapper',
];

const useMarqueeSelection = canvasRef => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectionPageId, setSelectionPageId] = useState(null);
  const selectionStartRef = useRef(null);

  const pages = usePropStore(state => state.pages);
  const zoom = useBuilderStore(state => state.zoom);
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setActiveElementsSelection = useBuilderStore(state => state.setActiveElementsSelection);

  const handleMouseDown = useCallback(e => {
    if (e.button !== 0) return;

    const { target } = e;

    // Don't start selection if clicking on an interactive element
    if (EXCLUDED_SELECTORS.some(selector => target.closest(selector))) {
      return;
    }

    // Find the page element from the click target
    const pageElement = target.closest('.jfReport-page')
      || target.closest('[id*="presentation-page-"]');
    if (!pageElement) return;

    const pageId = pageElement.getAttribute('data-id')
      || pageElement.getAttribute('id').replace('presentation-page-', '');
    if (!pageId) return;

    e.preventDefault();

    const pageRect = pageElement.getBoundingClientRect();
    const startX = e.clientX - pageRect.left;
    const startY = e.clientY - pageRect.top;

    selectionStartRef.current = { pageRect, startX, startY };
    setSelectionPageId(pageId);
    setSelectionBox({
      endX: startX,
      endY: startY,
      startX,
      startY,
    });
    setIsSelecting(true);
    resetActiveElements();
  }, [resetActiveElements]);

  const handleMouseMove = useCallback(e => {
    if (!isSelecting || !selectionStartRef.current) return;

    const { pageRect, startX, startY } = selectionStartRef.current;
    const endX = Math.max(0, Math.min(e.clientX - pageRect.left, pageRect.width));
    const endY = Math.max(0, Math.min(e.clientY - pageRect.top, pageRect.height));

    setSelectionBox({
      endX,
      endY,
      startX,
      startY,
    });
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !selectionBox || !selectionPageId) {
      setIsSelecting(false);
      setSelectionBox(null);
      selectionStartRef.current = null;
      return;
    }

    const page = pages.find(p => p.id === selectionPageId);

    if (page?.items) {
      const selectedItemIds = getItemsInSelectionBox(selectionBox, page.items, zoom);
      if (selectedItemIds.length > 0) {
        setActiveElementsSelection(selectedItemIds);
      }
    }

    setIsSelecting(false);
    setSelectionBox(null);
    setSelectionPageId(null);
    selectionStartRef.current = null;
  }, [isSelecting, selectionBox, selectionPageId, pages, zoom, setActiveElementsSelection]);

  // Canvas mouse down listener
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    return () => canvas.removeEventListener('mousedown', handleMouseDown);
  }, [canvasRef, handleMouseDown]);

  // Global mouse event listeners for drag
  useEffect(() => {
    if (!isSelecting) return;

    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  return {
    isSelecting,
    selectionBox,
    selectionPageId,
  };
};

export default useMarqueeSelection;
