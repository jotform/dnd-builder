import { useState, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import withClickOutside from '../withClickOutside';
import { useEventListener } from '../../utils/hooks';
import Textbox from './Textbox';

export const COLOR_PRESETS = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFF',
  '#FFFFFF',
];

export const ColorPickerWithClickOutside = withClickOutside(SketchPicker);

const ColorPicker = ({
  config,
  item,
  onItemChange,
  value,
}) => {
  const { defaultValue = '#FFFFFF' } = config;
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [colorValue, setColorValue] = useState(value || defaultValue);
  const pickerRef = useRef(null);

  const handleInputChange = (_item, _config) => {
    const newValue = _config[Object.keys(_config)[0]];
    setColorValue(newValue);
    onItemChange(_item, _config);
  };

  const checkPickerVisibility = () => isPickerVisible && setIsPickerVisible(false);
  useEventListener('resize', checkPickerVisibility);

  const handleOnChange = ({ hex }) => {
    if (hex !== colorValue) {
      setColorValue(hex);
    }
  };

  const handleColorPick = ({ hex }) => {
    if (hex !== value) {
      onItemChange(
        { id: item.id },
        { [config.key]: hex },
      );
    }
  };

  const setPickerVisibility = visibility => event => {
    if (visibility && window.innerHeight - event.clientY < 327) {
      setTimeout(() => {
        if (
          pickerRef.current
          && pickerRef.current.firstChild
          && pickerRef.current.firstChild.firstChild
        ) {
          pickerRef.current.firstChild.firstChild.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        }
      }, 0);
    }
    setIsPickerVisible(visibility);
  };

  return (
    <>
      <div
        className={`colorPicker-wrapper p-relative d-flex a-center${
          isPickerVisible ? ' pickerVisible' : ''
        }`}
        data-key={config.key}
        onClick={setPickerVisibility(!isPickerVisible)}
        onKeyPress={() => {}}
      >
        <Textbox
          config={config}
          item={item}
          onItemChange={handleInputChange}
          value={colorValue}
        />
        <div
          className="colorPicker-preview"
          style={{ backgroundColor: colorValue }}
        />
      </div>
      {isPickerVisible
        && (
          <div
            ref={pickerRef}
            onKeyDown={e => e.stopPropagation()}
          >
            <ColorPickerWithClickOutside
              color={colorValue}
              disableAlpha={true}
              exceptionalClasses={[`colorPicker-wrapper[data-key='${config.key}']`]}
              onChange={handleOnChange}
              onChangeComplete={handleColorPick}
              onClickOutside={setPickerVisibility(false)}
              presetColors={COLOR_PRESETS}
              withClickOutsideWrapperClass="colorPicker-holder"
            />
          </div>
        )}
    </>
  );
};

ColorPicker.propTypes = {
  config: PropTypes.shape({
    defaultValue: PropTypes.string,
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

ColorPicker.defaultProps = {
  config: [],
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(ColorPicker);
