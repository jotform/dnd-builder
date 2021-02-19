import React from 'react';
import PropTypes from 'prop-types';
import { safeJSONParse } from '../../utils/functions';

const CheckboxGroup = ({
  config,
  item,
  onItemChange,
  value,
}) => {
  const opts = config.options;
  const parsedValue = safeJSONParse(value, []);
  const val = parsedValue;

  const onChange = optionKey => e => {
    let newVal = [...val];
    if (e.target.checked) { // filter val
      newVal.push(optionKey);
    } else { // add val
      newVal = newVal.filter(o => o !== optionKey);
    }

    onItemChange({ id: item.id }, { [config.key]: JSON.stringify(newVal) });
  };

  return (
    <div
      className="jfReportSelectOption-list"
    >
      {opts.map(option => {
        return (
          <div
            key={option}
            className={`jfReportSelectOption${val.indexOf(option) !== -1 ? ' isSelected' : ''}`}
          >
            <div className="jfReportSelectOption-visibility">
              <label
                className="jfReportChoice isLight hasNotText"
                htmlFor={option}
              >
                <input
                  checked={val.indexOf(option) !== -1}
                  className="jfReportChoice-input"
                  id={option}
                  onChange={onChange(option)}
                  type="checkbox"
                />
                <div className="jfReportChoice-labelIcon">
                  <div className="jfReportChoice-label checkbox" />
                </div>
              </label>
            </div>
            <div className="jfReportSelectOption-name">
              <div className="jfReportSelectOption-text">
                {option}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

CheckboxGroup.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

CheckboxGroup.defaultProps = {
  config: {},
  item: {},
  onItemChange: () => {},
  value: [],
};

export default CheckboxGroup;
