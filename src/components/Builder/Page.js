import {
  useState,
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
  getCorrectDroppedOffsetValueBySnap,
  findItemById,
  getMatchesForItem,
  getCoordinatesFromMatches,
} from '../../utils/functions';
import * as classNames from '../../constants/classNames';
import generateId from '../../utils/generateId';

const Page = ({
  guides = {},
  items = [],
  page = {},
  style = {},
}) => {
  const activeElement = useBuilderStore(state => state.activeElement);
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const zoom = useBuilderStore(state => state.zoom);
  const isResize = useBuilderStore(state => state.isResize);

  const onItemAdd = usePropStore(state => state.onItemAdd);
  const onItemMove = usePropStore(state => state.onItemMove);
  const onItemsMove = usePropStore(state => state.onItemsMove);
  const additionalPageItems = usePropStore(state => state.additionalPageItems);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const settings = usePropStore(state => state.settings);
  const acceptedItems = usePropStore(state => state.acceptedItems);
  const pages = usePropStore(state => state.pages);

  const [matches, setMatches] = useState({});
  const requestRef = useRef();
  const dropRef = useRef(null); // for getting the bounding client rect

  const handleMatches = useCallback(item => {
    const newMatches = getMatchesForItem(item, guides, zoom);
    setMatches(newMatches);
  }, [guides, zoom]);

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
          handleMatches(activeItem);
        }
        requestRef.current = undefined;
      } catch (error) {
        setMatches({});
      }
    };
  };

  const isMultipleItemSelected = activeElement !== null && activeElement.length > 1;

  const onHover = (item, monitor) => {
    if (!requestRef.current) {
      requestRef.current = global.requestAnimationFrame(drawAlignmentGuides(item, monitor));
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: ACCEPTED_TYPES,
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
      };
    },
    drop: (item, monitor) => {
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
        onItemAdd({
          ...acceptedItems[itemType].details,
          id: itemID,
          pageID: page.id,
          ...coords,
          ...additionalData,
        });
        onAnEventTrigger('reportItemAdd', itemType);
        setActiveElement(itemID);
        setIsRightPanelOpen(true);
        newCoords[itemID] = coords;
      } else if (type === DRAGGABLE_ITEM_TYPE) {
        const newItem = { ...item, ...coords };
        const dragCoords = getCorrectDroppedOffsetValueBySnap(newItem, guides, zoom);
        if (isMultipleItemSelected) {
          const leftDifference = additionalData.left - dragCoords.left;
          const topDifference = additionalData.top - dragCoords.top;
          const _items = activeElement.reduce((acc, curr) => {
            const tempItem = findItemById(curr, pages);
            acc[curr] = {
              id: curr,
              left: tempItem.left - leftDifference,
              pageID: page.id,
              top: tempItem.top - topDifference,
            };
            newCoords[curr] = {
              left: tempItem.left - leftDifference,
              top: tempItem.top - topDifference,
            };
            return acc;
          }, {});
          onItemsMove({ items: _items });
        } else {
          onItemMove({
            id,
            pageID: page.id,
            ...dragCoords,
          });
          newCoords[id] = dragCoords;
        }
      }

      return newCoords;
    },
    hover: onHover,
  });

  const getIntersectionsFromMatches = useCallback(item => {
    const {
      left: newActiveBoxLeft,
      top: newActiveBoxTop,
    } = getCoordinatesFromMatches(item, matches);

    return { newActiveBoxLeft, newActiveBoxTop };
  }, [matches]);

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
            getIntersectionsFromMatches={getIntersectionsFromMatches}
            handleMatches={handleMatches}
            items={items}
          />
          {additionalPageItems}
          <AlignmentGuides
            axis="x"
            guides={guides[page.id]}
            matches={matches}
            show={(isOver || isResize)}
          />
          <AlignmentGuides
            axis="y"
            guides={guides[page.id]}
            matches={matches}
            show={(isOver || isResize)}
          />
        </div>
      </div>
    </>
  );
};

Page.propTypes = {
  guides: PropTypes.shape({}),
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  page: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  style: PropTypes.shape({}),
};

export default memo(Page);
