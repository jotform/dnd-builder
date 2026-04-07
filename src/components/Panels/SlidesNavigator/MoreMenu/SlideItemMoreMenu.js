import {
  forwardRef, useCallback, useImperativeHandle, useMemo, useState,
} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  useFocus,
  FloatingPortal,
  autoPlacement,
} from '@floating-ui/react';
import PropTypes from 'prop-types';
import * as icons from '../../../../utils/icons';
import { useTranslatedTexts } from '../../../../utils/hooks';
import { usePropStore } from '../../../../contexts/PropContext';
import { useBuilderStore } from '../../../../contexts/BuilderContext';

const PAGE_ACTIONS_SYNC_MS = 100;

const SlideItemMoreMenu = forwardRef(({ order, page }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rectPosition, setRectPosition] = useState({ left: 0, top: 0 });
  const setVisiblePageOrder = useBuilderStore(state => state.setVisiblePageOrder);

  const openCardContextMenu = useCallback((e, useMousePointer = false) => {
    if (isOpen) return;
    e.preventDefault();
    const cursorTarget = e.target;
    let { top } = cursorTarget.getBoundingClientRect();
    let { left } = cursorTarget.getBoundingClientRect();
    if (useMousePointer) {
      top = e.clientY;
      left = e.clientX;
    }
    const { innerHeight, innerWidth } = window;
    const floatingHeight = 196;
    const floatingWidth = 224;
    const innerLeftDecrement = (innerWidth - left) > floatingWidth;
    const innerTopDecrement = (innerHeight - top) > floatingHeight;
    const leftVal = !innerLeftDecrement ? left - floatingWidth : left;
    const topVal = !innerTopDecrement ? top - (floatingHeight) : top + (!useMousePointer ? 24 : 0);
    setRectPosition({ left: leftVal, top: topVal });
  }, [isOpen]);

  const onPageAdd = usePropStore(state => state.onPageAdd);
  const onPageDuplicate = usePropStore(state => state.onPageDuplicate);
  const onPageRemove = usePropStore(state => state.onPageRemove);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);

  const { ADD_NEW_SLIDE, DELETE_SLIDE, DUPLICATE_SLIDE } = useTranslatedTexts();

  const { context, floatingStyles, refs } = useFloating({
    middleware: [
      offset({
        crossAxis: 10000,
        mainAxis: 5,
      }),
      flip({
        crossAxis: true,
        fallbackAxisSideDirection: 'none',
      }),
      shift(),
      autoPlacement({
        alignment: 'start',
        crossAxis: true,
      }),
    ],
    onOpenChange: nextOpen => {
      setIsOpen(nextOpen);
    },
    open: isOpen,
    placement: 'bottom',
    strategy: 'fixed',
    transform: true,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, {
    event: 'click',
  });
  const dismiss = useDismiss(context, { ancestorScroll: true });
  const role = useRole(context);
  const focus = useFocus(context);

  const { getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
    focus,
  ]);

  const headingId = useId();

  const customStyles = {
    boxShadow: '0px 2px 4px 0px rgba(37, 45, 91, 0.04), 0px 8px 16px 0px rgba(84, 95, 111, 0.16)',
    left: rectPosition.left,
    top: rectPosition.top,
    transform: 'translate(9px, 0px)',
    zIndex: '99999',
  };

  const handleAddNewSlide = useCallback(() => {
    const nextPageOrder = order + 1;
    onPageAdd(nextPageOrder);
    onAnEventTrigger('addNewPageFromSlides', nextPageOrder);
    setIsOpen(false);
    window.setTimeout(() => {
      setVisiblePageOrder(nextPageOrder);
    }, PAGE_ACTIONS_SYNC_MS);
  }, [onPageAdd, order, onAnEventTrigger, setVisiblePageOrder]);

  const handleDuplicateSlide = useCallback(() => {
    const nextPageOrder = order + 1;
    onPageDuplicate(page);
    onAnEventTrigger('duplicatePage', nextPageOrder);
    setIsOpen(false);
    window.setTimeout(() => {
      setVisiblePageOrder(nextPageOrder);
    }, PAGE_ACTIONS_SYNC_MS);
  }, [onPageDuplicate, page, order, onAnEventTrigger, setVisiblePageOrder]);

  const handleDeleteSlide = useCallback(() => {
    onPageRemove(page.id);
    onAnEventTrigger('removePageFromSlides', page.id);
    setIsOpen(false);
    const visibleOrderAfterDelete = Math.max(order - 1, 1);
    window.setTimeout(() => {
      setVisiblePageOrder(visibleOrderAfterDelete);
    }, PAGE_ACTIONS_SYNC_MS);
  }, [page, order, onPageRemove, onAnEventTrigger, setVisiblePageOrder]);

  const schemaOptions = useMemo(() => {
    return (
      [
        {
          className: 'slides-navigator-context-menu-item',
          icon: <icons.plus className="slides-navigator-context-menu-item-icon" />,
          id: 'add_new_slide',
          isVisible: true,
          onClick: handleAddNewSlide,
          textClassName: 'slides-navigator-context-menu-item-text add',
          title: ADD_NEW_SLIDE,
        },
        {
          className: 'slides-navigator-context-menu-item',
          icon: <icons.duplicate className="slides-navigator-context-menu-item-icon" />,
          id: 'duplicate_slide',
          isVisible: true,
          onClick: handleDuplicateSlide,
          textClassName: 'slides-navigator-context-menu-item-text duplicate',
          title: DUPLICATE_SLIDE,
        },
        {
          className: 'slides-navigator-context-menu-item',
          icon: <icons.trash className="slides-navigator-context-menu-item-icon delete" />,
          id: 'delete_slide',
          isVisible: true,
          onClick: handleDeleteSlide,
          textClassName: 'slides-navigator-context-menu-item-text delete',
          title: DELETE_SLIDE,
        },
      ]
    );
  }, [handleAddNewSlide, handleDuplicateSlide, handleDeleteSlide, ADD_NEW_SLIDE, DUPLICATE_SLIDE, DELETE_SLIDE]);

  const handleOpenMenu = useCallback(e => {
    setIsOpen(true);
    openCardContextMenu(e, true);
  }, [openCardContextMenu]);

  useImperativeHandle(ref, () => {
    return {
      handleOpenMenu,
    };
  }, [handleOpenMenu]);

  return (
    <>
      {isOpen && (
        <FloatingPortal>
          {/* <PopoverOverlay /> */}
          <div
            ref={refs.setFloating}
            alignItems="start"
            aria-labelledby={headingId}
            className="slides-navigator-context-menu"
            direction="column"
            justifyContent="start"
            style={{
              ...floatingStyles,
              ...customStyles,
            }}
            {...getFloatingProps()}
          >
            <div
              className="slides-navigator-context-menu-items"
            >
              {schemaOptions.map(schemaOption => {
                return (
                  schemaOption.isVisible
                && (
                  <button
                    key={schemaOption.id}
                    className={schemaOption.className}
                    id={schemaOption.id}
                    onClick={schemaOption.onClick}
                    type="button"
                  >
                    {schemaOption.icon}
                    <span className={` ${schemaOption.textClassName}`}>{schemaOption.title}</span>
                  </button>
                )
                );
              })}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
});

SlideItemMoreMenu.propTypes = {
  order: PropTypes.number.isRequired,
  page: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default SlideItemMoreMenu;
