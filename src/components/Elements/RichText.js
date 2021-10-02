import {
  memo, useEffect, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import TextEditor from '../TextEditor';
import { fontTypes } from '../../constants/fonts';
import { useBuilderContext } from '../../utils/builderContext';
import { divider } from '../../utils/staticSettings';

const ITEM_TYPE = 'text';

const settings = [
  {
    key: 'fontFamily',
    label: 'Font Family',
    options: fontTypes.fonts,
    section: 'GENERAL',
    type: 'dropdown',
  },
  {
    ...divider('GENERAL'),
  },
  {
    key: 'opacity',
    label: 'Opacity',
    range: [0, 100],
    section: 'GENERAL',
    type: 'slider',
  },
];

const defaultItem = {
  fontFamily: 'Circular Std',
  opacity: 1,
  value: '',
};

export const RichTextElement = ({
  isSelected,
  item: {
    fontFamily,
    id,
    isLocked,
    opacity,
    value,
  },
  onItemChange,
}) => {
  const reportItem = useRef({});
  const { isTextEditorOpen } = useBuilderContext();

  const textStyle = {
    fontFamily,
    opacity,
  };

  const handleSave = useCallback(newValue => {
    onItemChange(
      { id },
      { value: newValue },
    );
  }, [id]);

  const onFocus = e => {
    e.currentTarget.parentElement.setAttribute('draggable', false);
  };

  useEffect(() => {
    if (!isTextEditorOpen) {
      reportItem.current.parentElement.setAttribute('draggable', true);
    }
  }, [isTextEditorOpen]);

  return (
    <div
      ref={reportItem}
      className="reportItemInner f-height"
      onFocus={onFocus}
      style={textStyle}
    >
      <TextEditor
        content={value}
        handleSave={handleSave}
        isLocked={isLocked}
        isSelected={isSelected}
        placeholder="Click to edit text"
      />
    </div>
  );
};

RichTextElement.propTypes = {
  isSelected: PropTypes.bool,
  item: PropTypes.shape({
    fontFamily: PropTypes.string,
    id: PropTypes.string,
    isLocked: PropTypes.bool,
    opacity: PropTypes.number,
    value: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

RichTextElement.defaultProps = {
  isSelected: false,
  item: {},
  onItemChange: () => { },
};

const details = {
  height: 65,
  itemType: ITEM_TYPE,
  width: 350,
};

export default {
  Component: memo(RichTextElement),
  defaultItem,
  details,
  itemType: ITEM_TYPE,
  settings,
};
