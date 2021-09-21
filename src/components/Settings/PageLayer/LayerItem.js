import { memo, useCallback } from 'react';
import { sortableElement, sortableHandle } from 'react-sortable-hoc';
import classNames from 'classnames';
import { capitalize, stripHTML } from '../../../utils/string';
import * as icons from '../../../utils/icons';

const DragHandle = sortableHandle(() => (
  <span className="jfReportSelectOption-drag">
    <icons.drag className="jfReportSVG icon-drag" />
  </span>
));

const LayerItem = sortableElement(({
  icon: Icon,
  item,
  onItemChange,
  optionKey,
  setActiveElement,
}) => {
  const { id, isVisible } = item;
  const isVisib = isVisible !== undefined ? isVisible : true;
  const handleItemLock = useCallback(({ target }) => {
    onItemChange({ id }, { isVisible: target.checked });
  }, [id]);

  const itemText = passedItem => {
    if (passedItem.itemType === 'shapes') {
      return capitalize(passedItem.shapeType || 'Rectangle');
    }
    if (passedItem.itemType === 'chart') {
      return passedItem.text || 'Chart Element';
    }
    if (passedItem.itemType === 'header') {
      return passedItem.headerText || 'Click to edit header';
    }
    if (passedItem.itemType === 'text') {
      return passedItem.value ? stripHTML(passedItem.value) : 'Click to edit text';
    }
    return capitalize(passedItem.itemType || 'Page Element');
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
    <div
      className={classNames('jfReportSelectOption', {
        isSelected: isVisib,
      })}
      onClick={() => setActiveElement(id, false)}
      onKeyDown={() => {}}
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
});

export default memo(LayerItem);
