import { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslatedTexts } from '../../utils/hooks';

const Toggle = ({
  config,
  item,
  onItemChange,
  value,
}) => {
  const onChange = e => {
    const status = e.target.checked ? 'on' : 'off';
    onItemChange(
      { id: item.id },
      { [config.key]: status },
    );
  };

  const { TOGGLE_OFF, TOGGLE_ON } = useTranslatedTexts();

  return (
    <label
      className="reportToolToggle"
      htmlFor={config.key}
    >
      <input
        checked={value === 'on'}
        id={config.key}
        onChange={onChange}
        type="checkbox"
      />
      <span className="reportToolToggle-knob" />
      <span className="reportToolToggle-on reportToolToggle-text">{TOGGLE_ON}</span>
      <span className="reportToolToggle-off reportToolToggle-text">{TOGGLE_OFF}</span>
    </label>
  );
};

Toggle.propTypes = {
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

Toggle.defaultProps = {
  config: {},
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(Toggle);
