import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as icons from '../../utils/icons';

const SelectBox = ({
  config = [],
  item = {},
  onItemChange = () => {},
  value = '',
}) => {
  const handleSelection = newValue => () => {
    if (value !== newValue) {
      onItemChange(
        { id: item.id },
        { [config.key]: newValue },
      );
    }
  };
  const { options } = config;

  return (
    <div className="toolSection-list withIcons bigList forShapes d-flex dir-row f-wrap">
      {options.map(option => {
        const OptionIcon = option.icon
          ? option.icon
          : icons[option.name] || icons.shapes;

        return (
          <button
            key={option.name}
            className={classNames(
              'toolSection-listItem',
              'd-flex a-center',
              'f-width',
              { isSelected: option.name === value },
            )}
            onClick={handleSelection(option.name)}
            type="button"
          >
            <span className="d-flex j-center a-center">
              <OptionIcon className="jfReportSVG" />
            </span>
            <span className="toolSection-listItemName d-flex j-between a-center">
              <span>{option.title}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

SelectBox.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

export default memo(SelectBox);
