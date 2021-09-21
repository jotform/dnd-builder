import { memo } from 'react';
import PropTypes from 'prop-types';
import { fieldSet } from '../../utils/staticSettings';
import * as icons from '../../utils/iconSelector';

const ITEM_TYPE = 'icon';
const iconStyle = {
  height: '100%',
  width: '100%',
};

const settings = [
  {
    key: 'iconType',
    label: 'Icon Type',
    section: 'General',
    type: 'iconSelectBox',
  },
  {
    ...fieldSet('Details', 'Icon Style'),
  },
  {
    key: 'iconFillColor',
    label: 'Color',
    section: 'Details',
    type: 'colorPicker',
  },
  {
    key: 'opacity',
    label: 'Opacity',
    range: [0, 100],
    section: 'Details',
    type: 'slider',
  },
  {
    key: 'sizeSettings',
    label: 'Size',
    section: 'Details',
    type: 'sizeSettings',
    value: (_, { height, width }) => `${width}x${height}`,
  },
];

export const IconElement = ({
  item: {
    iconFillColor,
    iconType,
    opacity,
  },
}) => {
  const Icon = icons[iconType];
  return (<Icon style={{ fill: iconFillColor, fillOpacity: opacity, ...iconStyle }} />);
};

IconElement.propTypes = {
  item: PropTypes.shape({
    height: PropTypes.number,
    iconFillColor: PropTypes.string,
    iconType: PropTypes.string,
    opacity: PropTypes.number,
    width: PropTypes.number,
  }),
};

IconElement.defaultProps = {
  item: {},
};

const details = {
  height: 200,
  iconFillColor: '#000000',
  iconType: 'heart',
  itemType: ITEM_TYPE,
  opacity: 1,
  width: 200,
};

export default {
  Component: memo(IconElement),
  details,
  itemType: ITEM_TYPE,
  settings,
};
