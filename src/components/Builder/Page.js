import {
  useState,
  useRef,
  memo,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { ACCEPTED_TYPES } from '../../constants/itemTypes';
import AlignmentGuides from '../AlignmentGuides';
import ReportItemsWrapper from '../ReportItemsWrapper';
import { useBuilderContext } from '../../utils/builderContext';
import { usePropContext } from '../../utils/propContext';
import {
  proximityListener,
  calculateGuidePositions,
  getCorrectDroppedOffsetValue,
} from '../../utils/functions';
import * as classNames from '../../constants/classNames';

const emptyObject = {};

const Page = ({
  activeElement = null,
  additionalPageItems = [],
  guides = {},
  hashCode = '',
  itemAccessor = () => {},
  items = [],
  onDrop = () => {},
  onItemAdd = () => {},
  onItemChange = () => {},
  onItemRemove = () => {},
  onItemResize = () => {},
  page = {},
  pageRef = {},
  style = {},
}) => {
  const {
    isRightPanelOpen,
    isTextEditorOpen,
    setActiveElement,
    setContextMenuProps,
    setIsRightPanelOpen,
    zoom,
  } = useBuilderContext();
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
          ...guides,
          [item.id]: {
            ...guides[item.id],
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

  const onHover = (item, monitor) => {
    if (!requestRef.current) {
      requestRef.current = global.requestAnimationFrame(drawAlignmentGuides(item, monitor));
    }
  };

  const dropConfig = useMemo(() => ({
    accept: ACCEPTED_TYPES,
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
      };
    },
    drop: onDrop,
    hover: onHover,
  }), [onDrop, onHover]);

  const [{ isOver }, drop] = useDrop(dropConfig);

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
            activeElement={activeElement}
            guides={guides}
            hashCode={hashCode}
            isResize={isResize}
            isRightPanelOpen={isRightPanelOpen}
            isTextEditorOpen={isTextEditorOpen}
            itemAccessor={itemAccessor}
          // if we send matches all the time, DraggableItems are also rendered on dragging
            items={items}
            matches={isResize ? matches : emptyObject}
            onAnEventTrigger={onAnEventTrigger}
            onItemAdd={onItemAdd}
            onItemChange={onItemChange}
            onItemRemove={onItemRemove}
            onItemResize={onItemResize}
            setActiveElement={setActiveElement}
            setContextMenuProps={setContextMenuProps}
            setIsResize={setIsResize}
            setIsRightPanelOpen={setIsRightPanelOpen}
            setMatches={setMatches}
            zoom={zoom}
          />
          {additionalPageItems}
          <AlignmentGuides
            axis="x"
            guides={guides}
            matches={matches}
            show={(isOver || isResize)}
            zoom={zoom}
          />
          <AlignmentGuides
            axis="y"
            guides={guides}
            matches={matches}
            show={(isOver || isResize)}
            zoom={zoom}
          />
        </div>
      </div>
    </>
  );
};

Page.propTypes = {
  activeElement: PropTypes.arrayOf(PropTypes.string),
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  guides: PropTypes.shape({}),
  hashCode: PropTypes.string,
  itemAccessor: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  onDrop: PropTypes.func,
  onItemAdd: PropTypes.func,
  onItemChange: PropTypes.func,
  onItemRemove: PropTypes.func,
  onItemResize: PropTypes.func,
  page: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  pageRef: PropTypes.shape({
    current: PropTypes.any,
  }),
  style: PropTypes.shape({}),
};

export default memo(Page);
