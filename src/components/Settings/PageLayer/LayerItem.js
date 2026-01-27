import { memo, useCallback, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { capitalize, stripHTML } from '../../../utils/string';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const DragHandle = () => (
  <span className="jfReportSelectOption-drag">
    <icons.drag className="jfReportSVG icon-drag" />
  </span>
);

const LayerItem = ({
  icon: Icon,
  id: itemId,
  item,
  onItemChange,
  optionKey,
  setActiveElement,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: itemId });

  const dragStyle = useMemo(() => ({
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition: transition,
  }), [transform, transition, isDragging]);

  const { id, isVisible } = item;
  const isVisib = isVisible !== undefined ? isVisible : true;

  const {
    CHART_ELEMENT,
    CLICK_TO_EDIT_TEXT,
    CLIK_TO_EDIT_HEADER,
    PAGE_ELEMENT,
    RECTANGLE,
  } = useTranslatedTexts();

  const handleItemLock = useCallback(({ target }) => {
    onItemChange({ id }, { isVisible: target.checked });
  }, [id, onItemChange]);

  const itemText = useMemo(() => {
    if (item.itemType === 'shapes') {
      return capitalize(item.shapeType || RECTANGLE);
    }
    if (item.itemType === 'chart') {
      return item.text || CHART_ELEMENT;
    }
    if (item.itemType === 'header') {
      return item.headerText || CLIK_TO_EDIT_HEADER;
    }
    if (item.itemType === 'text') {
      return item.value ? stripHTML(item.value) : CLICK_TO_EDIT_TEXT;
    }
    return capitalize(item.itemType || PAGE_ELEMENT);
  }, [
    item.itemType,
    item.shapeType,
    item.headerText,
    item.text,
    item.value,
    RECTANGLE,
    CHART_ELEMENT,
    CLIK_TO_EDIT_HEADER,
    CLICK_TO_EDIT_TEXT,
    PAGE_ELEMENT,
  ]);

  const content = useMemo(() => (
    <div className="jfReportSelectOption">
      <div className="jfReportSelectOption-icon">
        <Icon />
      </div>
      <div className="jfReportSelectOption-text">
        {itemText}
      </div>
    </div>
  ), [itemText]);

  return (
    <div
      ref={setNodeRef}
      className={classNames('jfReportSelectOption', {
        isSelected: isVisib,
      })}
      onClick={() => setActiveElement(id, false)}
      onKeyDown={() => {}}
      style={dragStyle}
      {...attributes}
      {...listeners}
    >
      <div className="jfReportSelectOption-visibility">
        <label
          className="jfReportChoice isLight hasNotText"
          htmlFor={optionKey}
        >
          <input
            checked={isVisib}
            className="jfReportChoice-input"
            data-option-key={optionKey}
            id={optionKey}
            onChange={handleItemLock}
            type="checkbox"
          />
          <div className="jfReportChoice-labelIcon">
            <div className="jfReportChoice-label checkbox" />
          </div>
        </label>
      </div>
      <div
        className="jfReportSelectOption-name"
        // style={{ backgroundColor: option.color }}
      >
        <DragHandle />
        {content}
      </div>
    </div>
  );
};

LayerItem.propTypes = {
  icon: PropTypes.elementType,
  id: PropTypes.string,
  item: PropTypes.shape({
    headerText: PropTypes.string,
    id: PropTypes.string,
    isVisible: PropTypes.bool,
    itemType: PropTypes.string,
    shapeType: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  optionKey: PropTypes.string,
  setActiveElement: PropTypes.func,
};

export default memo(LayerItem);
