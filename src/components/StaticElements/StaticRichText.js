import { memo } from 'react';
import PropTypes from 'prop-types';
import domPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import { fontTypes } from '../../constants/fonts';

const ITEM_TYPE = 'text';

const StaticRichTextElement = ({
  item: {
    fontFamily,
    opacity,
    value,
  },
}) => (
  <div
    className="reportItemInner f-height"
    style={{ fontFamily, opacity }}
  >
    <div
      className="f-all ql-editor"
      dangerouslySetInnerHTML={{ __html: domPurify.sanitize(value) }}
    />
  </div>
);

StaticRichTextElement.propTypes = {
  item: PropTypes.shape({
    fontFamily: PropTypes.string,
    opacity: PropTypes.number,
    value: PropTypes.string,
  }),
};

StaticRichTextElement.defaultProps = {
  item: {
    value: '',
  },
};

const details = {
  height: 65,
  itemType: ITEM_TYPE,
  width: 350,
};

const defaultItem = {
  fontFamily: 'Circular Std',
  opacity: 1,
  value: '',
};

const settings = [
  {
    key: 'fontFamily',
    label: 'Font Family',
    options: fontTypes.fonts,
    section: 'GENERAL',
    type: 'dropdown',
  },
  {
    key: 'opacity',
    label: 'Opacity',
    range: [0, 100],
    section: 'GENERAL',
    type: 'slider',
  },
];

export default {
  Component: memo(StaticRichTextElement),
  defaultItem,
  details,
  itemType: ITEM_TYPE,
  settings,
};
