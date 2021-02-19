import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Slider = ({
  config,
  item,
  onItemChange,
  value,
}) => {
  const { range, simple } = config;
  const refValue = simple ? 1 : 100;
  const onChange = e => {
    const newValue = e.target.value;
    if (newValue !== value) {
      if (newValue >= range[0] && newValue <= range[1]) {
        onItemChange(
          { id: item.id },
          { [config.key]: newValue / refValue },
        );
      }
    }
  };

  const onKeyDown = event => {
    event.stopPropagation();
    if (event.shiftKey) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const diff = event.key === 'ArrowUp' ? 10 : -10;
        onChange({
          target: {
            value: Number(value) + diff,
          },
        });
      }
    }
  };

  return (
    <div className="rangeSliderWrapper d-flex a-center">
      <div className="rangeSlider">
        <input
          className="rangeSlider-bar"
          max={range[1]}
          min={range[0]}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type="range"
          value={value * refValue}
        />
        <div
          className="rangeSlider-indicator"
          style={{
            width: `
              ${simple ? (value / range[1]) * 100 : parseFloat(value, 10) * refValue}%
            `,
          }}
        />
      </div>
      <div className={`hasUnit ${simple ? 'isPixel' : 'isPercentage'}`}>
        <input
          className="toolSection-input isSmall"
          max={range[1]}
          min={range[0]}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type="number"
          value={(value * refValue).toFixed(0)}
        />
      </div>
    </div>
  );
};

Slider.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
    range: PropTypes.arrayOf(PropTypes.number),
    simple: PropTypes.bool,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Slider.defaultProps = {
  config: {},
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(Slider);
