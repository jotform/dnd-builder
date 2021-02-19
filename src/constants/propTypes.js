import PropTypes from 'prop-types';

export const leftPanelConfigPropType = PropTypes.arrayOf(
  PropTypes.shape({
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        itemType: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    title: PropTypes.string,
  }),
);
