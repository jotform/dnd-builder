/* eslint-disable */
import PropTypes from 'prop-types';
import * as icons from '../../utils/iconSelector';

const IconSelectBox = ({
  config, item, onItemChange, value,
}) => {
  const handleIconSelect = e => {
    const newValue = e.target.value;
    if (value !== newValue) {
      onItemChange(
        { id: item.id },
        { [config.key]: newValue },
      );
    }
  };

  return (
    <div className="toolSection-list forIcons d-flex f-wrap">
      <div className="tabContent">
        <div className="iconSelector">
          {Object.keys(icons).map(iconType => {
            const Icon = icons[iconType];
            return (
              <div
                key={iconType}
                className="iconSelector-item"
              >
                <input
                  checked={iconType === value ? true : false}
                  className="iconSelector-input"
                  id={iconType}
                  name="iconSelector"
                  onChange={handleIconSelect}
                  type="radio"
                  value={iconType}
                />
                <label
                  className="iconSelector-label"
                  htmlFor={iconType}
                >
                  <Icon
                    key={iconType}
                    className="jfReportSVG iconSelector-icon"
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

IconSelectBox.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

IconSelectBox.defaultProps = {
  config: {},
  item: {},
  onItemChange: () => {},
  value: '',
};

export default IconSelectBox;
