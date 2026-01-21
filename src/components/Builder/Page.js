import {
  useState,
  useRef,
  memo,
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
  proximityListener,
  calculateGuidePositions,
  getCorrectDroppedOffsetValue,
  getCorrectDroppedOffsetValueBySnap,
  findItemById,
} from '../../utils/functions';
import * as classNames from '../../constants/classNames';
import generateId from '../../utils/generateId';

const emptyObject = {};

const Page = ({
  guides = {},
  items = [],
  page = {},
  pageRef = {},
  style = {},
}) => {
  const activeElement = useBuilderStore(state => state.activeElement);
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const zoom = useBuilderStore(state => state.zoom);

  const onItemAdd = usePropStore(state => state.onItemAdd);
  const onItemMove = usePropStore(state => state.onItemMove);
  const onItemsMove = usePropStore(state => state.onItemsMove);
  const additionalPageItems = usePropStore(state => state.additionalPageItems);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);
  const settings = usePropStore(state => state.settings);
  const acceptedItems = usePropStore(state => state.acceptedItems);
  const pages = usePropStore(state => state.pages);

  const [matches, setMatches] = useState({});
  const [isResize, setIsResize] = useState(false);
  const requestRef = useRef();

  const drawAlignmentGuides = (item, monitor) => {
    return () => {
      try {
        if (!monitor || monitor.getSourceClientOffset() === null) {
          requestRef.current = undefined;
          return;
        }
        const coords = getCorrectDroppedOffsetValue(
          monitor,
          pageRef.current.getBoundingClientRect(),
          zoom,
        );
        const activeItem = {
          ...item, ...coords,
        };
        const _guides = {
          ...guides[item.pageID],
          [item.id]: {
            ...guides[item.pageID][item.id],
            x: calculateGuidePositions(activeItem, 'x', zoom),
            y: calculateGuidePositions(activeItem, 'y', zoom),
          },
        };
        const match = proximityListener(item.id, _guides);
        setMatches(match);
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
      const pageClient = pageRef.current?.getBoundingClientRect();
      const coords = getCorrectDroppedOffsetValue(
        monitor,
        pageClient,
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
        const dragCoords = getCorrectDroppedOffsetValueBySnap(coords, guides, id, pages, zoom);
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

  const { reportBackgroundColor } = settings;
  const { backgroundColor } = page;
  const bgColor = backgroundColor ? backgroundColor : reportBackgroundColor || '#fff';

  return (
    <>
      <div
        ref={drop}
        className={classNames.pageContainer}
        style={{
          backgroundColor: bgColor,
          ...style,
        }}
      >
        <div className="jfReport-hider o-hidden f-all p-relative">
          <ReportItemsWrapper
            guides={guides[page.id]}
            isResize={isResize}
            // if we send matches all the time, DraggableItems are also rendered on dragging
            items={items}
            matches={isResize ? matches : emptyObject}
            setIsResize={setIsResize}
            setMatches={setMatches}
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
  pageRef: PropTypes.shape({
    current: PropTypes.any,
  }),
  style: PropTypes.shape({}),
};

export default memo(Page);
