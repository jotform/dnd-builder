import { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { safeJSONParse } from '../../utils/functions';

const Orientation = ({
  config = [],
  item = {},
  onItemChange = () => {},
  value = '',
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
    <div className="toolSection-orientation d-flex dir-row">
      {options.map(option => {
        const key = option.value ? option.value : option;
        return (
          <button
            key={key}
            className={classNames(
              'toolSection-orientationItem',
              'd-flex',
              'j-center',
              {
                isSelected: !multipleSelect
                  ? exactValue === key
                  : exactValue && exactValue.includes(key),
              },
            )}
            data-orientation={key}
            onClick={onClick(key)}
            type="button"
          >
            {optionsDisplay ? optionsDisplay.map(display => (
              <Fragment key={display}>
                <span className="orientationIcon d-flex a-center j-center">
                  {option[display]}
                </span>
                <span>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </Fragment>
            )) : option.label}
          </button>
        );
      })}
    </div>
  );
};

Orientation.propTypes = {
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

export default memo(Orientation);
