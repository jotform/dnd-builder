import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { safeJSONParse } from '../../utils/functions';

const SegmentControl = ({
  config, item, onItemChange, value,
}) => {
  const { multipleSelect, options, optionsDisplay } = config;
  const exactValue = !multipleSelect ? value : safeJSONParse(value, []);
  const onClick = type => {
    return () => {
      let newValue = type;
      if (multipleSelect) {
        newValue = [...exactValue];
        if (exactValue.includes(type)) {
          newValue = newValue.filter(v => v !== type);
        } else {
          newValue.push(type);
        }
        newValue = JSON.stringify(newValue);
      }
      if (newValue !== value) {
        onItemChange(
          { id: item.id },
          { [config.key]: newValue },
        );
      }
    };
  };
  return (
    <div className="toolSection-list d-flex dir-row forSegments">
      {options.map(option => {
        const key = option.value ? option.value : option;
        return (
          <button
            key={key}
            className={classNames(
              'toolSection-listItem',
              'd-flex',
              'j-center',
              {
                isSelected: !multipleSelect
                  ? exactValue === key
                  : exactValue && exactValue.includes(key),
              },
            )}
            onClick={onClick(key)}
            type="button"
          >
            {optionsDisplay ? optionsDisplay.map(display => (
              <React.Fragment key={display}>
                {option[display]}
              </React.Fragment>
            )) : option.label}
          </button>
        );
      })}
    </div>
  );
};

SegmentControl.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    multipleSelect: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.any),
    optionsDisplay: PropTypes.arrayOf(PropTypes.any),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

SegmentControl.defaultProps = {
  config: [],
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(SegmentControl);
