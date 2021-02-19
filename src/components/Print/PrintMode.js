import React from 'react';
import PropTypes from 'prop-types';
import objectHash from 'object-hash';
import { PropProvider } from '../../utils/propContext';
import PrintModeWithoutContext from './PrintModeWithoutContext';

import '../../styles/jfReportsBundle.scss';

const PrintMode = ({
  acceptedItems,
  additionalPageItems,
  itemAccessor,
  pages,
  settings,
  ...otherProps
}) => {
  const hashCode = objectHash(otherProps);

  return (
    <PropProvider
      acceptedItems={acceptedItems}
      settings={settings}
    >
      <PrintModeWithoutContext
        additionalPageItems={additionalPageItems}
        hashCode={hashCode}
        itemAccessor={itemAccessor}
        pages={pages}
        settings={settings}
      />
    </PropProvider>
  );
};

PrintMode.propTypes = {
  acceptedItems: PropTypes.shape({}),
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  itemAccessor: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  settings: PropTypes.shape({}),
};

PrintMode.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  itemAccessor: () => {},
  pages: [],
  settings: {},
};

export default PrintMode;
