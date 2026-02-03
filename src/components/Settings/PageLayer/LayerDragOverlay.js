import { memo } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { capitalize, stripHTML } from '../../../utils/string';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const DragHandle = () => (
  <span className="jfReportSelectOption-drag">
    <icons.drag className="jfReportSVG icon-drag" />
  </span>
);

const LayerDragOverlay = ({
  activeItemData,
}) => {
  const {
    CHART_ELEMENT,
    CLICK_TO_EDIT_TEXT,
    CLIK_TO_EDIT_HEADER,
    PAGE_ELEMENT,
    RECTANGLE,
  } = useTranslatedTexts();

  const { icon: Icon, item } = activeItemData;
  const { id, isVisible } = item;
  const isVisib = isVisible !== undefined ? isVisible : true;

  const itemText = passedItem => {
    if (passedItem.itemType === 'shapes') {
      return capitalize(passedItem.shapeType || RECTANGLE);
    }
    if (passedItem.itemType === 'chart') {
      return passedItem.text || CHART_ELEMENT;
    }
    if (passedItem.itemType === 'header') {
      return passedItem.headerText || CLIK_TO_EDIT_HEADER;
    }
    if (passedItem.itemType === 'text') {
      return passedItem.value ? stripHTML(passedItem.value) : CLICK_TO_EDIT_TEXT;
    }
    return capitalize(passedItem.itemType || PAGE_ELEMENT);
  };

  const content = (
    <div className="jfReportSelectOption">
      <div className="jfReportSelectOption-icon">
        <Icon />
      </div>
      <div className="jfReportSelectOption-text">
        {itemText(item)}
      </div>
    </div>
  );

  return (
    <DragOverlay
      adjustScale={false}
      dropAnimation={null}
      style={{ cursor: 'grabbing' }}
    >
      <div
        className={classNames('jfReportSelectOption forHelper withDnd', {
          isSelected: isVisib,
        })}
        style={{ opacity: 0.9, transform: 'rotate(2deg)' }}
      >
        <div className="jfReportSelectOption-visibility">
          <label
            className="jfReportChoice isLight hasNotText"
            htmlFor={`overlay-${id}`}
          >
            <input
              checked={isVisib}
              className="jfReportChoice-input"
              id={`overlay-${id}`}
              readOnly
              type="checkbox"
            />
            <div className="jfReportChoice-labelIcon">
              <div className="jfReportChoice-label checkbox" />
            </div>
          </label>
        </div>
        <div className="jfReportSelectOption-name">
          <DragHandle />
          {content}
        </div>
      </div>
    </DragOverlay>
  );
};

LayerDragOverlay.propTypes = {
  activeItemData: PropTypes.shape({
    icon: PropTypes.elementType,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isVisible: PropTypes.bool,
      itemType: PropTypes.string,
    }),
  }).isRequired,
};

export default memo(LayerDragOverlay);
