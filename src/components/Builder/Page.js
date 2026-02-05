import {
  useRef,
  memo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import {
  ACCEPTED_TYPES,
  DRAGGABLE_ITEM_TYPE,
  DROPPABLE_ITEM_TYPE,
} from '../../constants/itemTypes';
import AlignmentGuides from '../AlignmentGuides';
import ReportItemsWrapper from '../ReportItemsWrapper';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';
import {
  getCorrectDroppedOffsetValue,
  findItemById,
  getMatchesForItem,
  roundPositionValues,
  getCoordinatesFromMatches,
} from '../../utils/functions';
import * as classNames from '../../constants/classNames';
import generateId from '../../utils/generateId';
import { useSelectedElements } from '../../utils/hooks';

const axes = ['x', 'y'];

const Page = ({
  items = [],
  page = {},
  style = {},
}) => {
  const activeElements = useBuilderStore(state => state.activeElements);
  const setActiveElements = useBuilderStore(state => state.setActiveElements);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const zoom = useBuilderStore(state => state.zoom);
  const isResize = useBuilderStore(state => state.isResize);
  const guides = useBuilderStore(state => state.guides);
  const matches = useBuilderStore(state => state.matches);
  const setMatches = useBuilderStore(state => state.setMatches);

  const onItemAdd = usePropStore(state => state.onItemAdd);
  const onItemMove = usePropStore(state => state.onItemMove);
  const onItemsMove = usePropStore(state => state.onItemsMove);
  const additionalPageItems = usePropStore(state => state.additionalPageItems);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const settings = usePropStore(state => state.settings);
  const acceptedItems = usePropStore(state => state.acceptedItems);
  const pages = usePropStore(state => state.pages);

  const requestRef = useRef();
  const dropRef = useRef(null); // for getting the bounding client rect

  const drawAlignmentGuides = (item, monitor) => {
    return () => {
      try {
        if (!monitor || monitor.getSourceClientOffset() === null) {
          requestRef.current = undefined;
          return;
        }
        const coords = getCorrectDroppedOffsetValue(
          monitor.getSourceClientOffset(),
          monitor.getInitialSourceClientOffset(),
          dropRef.current.getBoundingClientRect(),
          zoom,
        );
        const activeItem = {
          ...item, ...coords,
        };
        if (activeItem.id && activeItem.pageID) {
          const newMatches = getMatchesForItem(activeItem, guides, zoom);
          setMatches(newMatches);
        }
        requestRef.current = undefined;
      } catch (error) {
        setMatches({});
      }
    };
  };

  const isMultipleItemSelected = activeElements.length > 1;

  const onHover = (item, monitor) => {
    if (!requestRef.current) {
      requestRef.current = global.requestAnimationFrame(drawAlignmentGuides(item, monitor));
    }
  };

  const selectedElements = useSelectedElements();

  const [{ isOver }, drop] = useDrop({
    accept: ACCEPTED_TYPES,
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
      };
    },
    drop: (item, monitor) => {
      setMatches({});
      const coords = getCorrectDroppedOffsetValue(
        monitor.getSourceClientOffset(),
        monitor.getInitialSourceClientOffset(),
        dropRef.current?.getBoundingClientRect(),
        zoom,
      );
      const type = monitor.getItemType();
      const {
        id, itemType, pageID, ...additionalData
      } = item;
      const newCoords = {};
      if (type === DROPPABLE_ITEM_TYPE) {
        const itemID = generateId();
        const roundedCoords = roundPositionValues(coords);
        onItemAdd({
          ...acceptedItems[itemType].details,
          id: itemID,
          pageID: page.id,
          ...roundedCoords,
          ...additionalData,
        });
        onAnEventTrigger('reportItemAdd', itemType);
        setActiveElements(itemID);
        setIsRightPanelOpen(true);
        newCoords[itemID] = roundedCoords;
      } else if (type === DRAGGABLE_ITEM_TYPE) {
        const newItem = { ...item, ...coords };
        const newMatches = getMatchesForItem(newItem, guides, zoom);
        const dragCoords = getCoordinatesFromMatches(newItem, newMatches, zoom);
        const roundedDragCoords = roundPositionValues(dragCoords);
        if (isMultipleItemSelected) {
          const leftDifference = additionalData.left - roundedDragCoords.left;
          const topDifference = additionalData.top - roundedDragCoords.top;
          const _items = activeElements.reduce((acc, curr) => {
            const tempItem = findItemById(curr, pages);
            const itemLeft = Math.round(tempItem.left - leftDifference);
            const itemTop = Math.round(tempItem.top - topDifference);
            acc[curr] = {
              id: curr,
              left: itemLeft,
              pageID: page.id,
              top: itemTop,
            };
            newCoords[curr] = {
              left: itemLeft,
              top: itemTop,
            };
            return acc;
          }, {});
          onItemsMove({ items: _items });
        } else {
          onItemMove({
            id,
            pageID: page.id,
            ...roundedDragCoords,
          });
          newCoords[id] = roundedDragCoords;
        }
      }

      return newCoords;
    },
    hover: onHover,
  });

  const combinedRef = useCallback(node => {
    dropRef.current = node;
    drop(node);
  }, [drop]);

  const { reportBackgroundColor } = settings;
  const { backgroundColor } = page;
  const bgColor = backgroundColor ? backgroundColor : reportBackgroundColor || '#fff';

  return (
    <>
      <div
        ref={combinedRef}
        className={classNames.pageContainer}
        style={{
          backgroundColor: bgColor,
          ...style,
        }}
      >
        <div className="jfReport-hider o-hidden f-all p-relative">
          <ReportItemsWrapper
            items={items}
          />
          {additionalPageItems}
          {/* when isOver is true, the alignment guides are shown completely */}
          {/* when isResize is true, the alignment guides are shown only for the page of the selected element */}
          {(isOver || (isResize && selectedElements[0]?.pageID === page.id)) && axes.map(axis => {
            if (!matches[axis]) return null;
            return (
              <AlignmentGuides
                key={axis}
                axis={axis}
                guides={guides[page.id]}
                matches={matches[axis]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

Page.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  page: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  style: PropTypes.shape({}),
};

export default memo(Page);
