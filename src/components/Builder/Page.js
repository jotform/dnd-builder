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
import { usePropContext } from '../../contexts/PropContext';
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
  additionalPageItems = [],
  guides = {},
  hashCode = '',
  itemAccessor = () => {},
  items = [],
  onItemAdd = () => {},
  onItemChange = () => {},
  onItemMove = () => {},
  onItemRemove = () => {},
  onItemResize = () => {},
  onItemsMove = () => {},
  page = {},
  pageRef = {},
  pages = [],
  style = {},
}) => {
  const activeElement = useBuilderStore(state => state.activeElement);
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const zoom = useBuilderStore(state => state.zoom);
  const { acceptedItems, onAnEventTrigger, settings } = usePropContext();
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
            acceptedItems={acceptedItems}
            guides={guides[page.id]}
            hashCode={hashCode}
            isResize={isResize}
            itemAccessor={itemAccessor}
          // if we send matches all the time, DraggableItems are also rendered on dragging
            items={items}
            matches={isResize ? matches : emptyObject}
            onAnEventTrigger={onAnEventTrigger}
            onItemAdd={onItemAdd}
            onItemChange={onItemChange}
            onItemRemove={onItemRemove}
            onItemResize={onItemResize}
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
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  guides: PropTypes.shape({}),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  onItemAdd: PropTypes.func,
  onItemChange: PropTypes.func,
  onItemMove: PropTypes.func,
  onItemRemove: PropTypes.func,
  onItemResize: PropTypes.func,
  onItemsMove: PropTypes.func,
  page: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  pageRef: PropTypes.shape({
    current: PropTypes.any,
  }),
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  style: PropTypes.shape({}),
};

export default memo(Page);
