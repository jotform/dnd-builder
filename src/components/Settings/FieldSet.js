import { memo } from 'react';
import PropTypes from 'prop-types';

const FieldSet = ({ config: { label } = {} }) => {
  return (
    <div className="toolSection toolSection-title t-medium fieldset">
      {label}
    </div>
  );
};

FieldSet.propTypes = {
  config: PropTypes.shape({
    label: PropTypes.string,
  }),
};

export default memo(FieldSet);
