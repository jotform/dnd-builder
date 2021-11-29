import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Builder from './Builder';
import Presentation from './Presentation/Presentation';
import Preview from './Preview';
import Print from './Print';
import reportsAppTexts, { SharingTextsModule } from '../constants/texts';

const Report = ({
  leftPanelConfig,
  mode,
  reportsAppTexts: newReportsAppTexts,
  ...props
}) => {
  const [viewMode, setViewMode] = useState(mode);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    SharingTextsModule.setTexts(newReportsAppTexts);
  }, [newReportsAppTexts]);

  useEffect(() => {
    if (['customize', 'preview'].indexOf(viewMode) > -1) {
      setLastScrollPosition(document.querySelector('.jfReport-viewport').scrollTop);
    }
    setViewMode(mode);
  }, [mode]);

  const customProps = { ...props, lastScrollPosition, leftPanelConfig };

  switch (viewMode) {
    case 'preview': {
      return <Preview {...customProps} />;
    }
    case 'presentation': {
      return <Presentation {...props} />;
    }
    case 'print': {
      return <Print {...props} />;
    }
    case 'customize':
    default: {
      return <Builder {...customProps} />;
    }
  }
};

Report.propTypes = {
  /** Conditionally rendering different modes  */
  mode: PropTypes.oneOf(['customize', 'preview', 'print', 'presentation']),
  /**
   It can be changed static texts or translated which use in the library.
   New texts are set when you pass again.
  */
  reportsAppTexts: PropTypes.shape({}),
  theme: PropTypes.oneOf(['lightMode', 'darkMode']),
};

Report.defaultProps = {
  mode: 'customize',
  reportsAppTexts,
  theme: 'lightMode',
};

export default Report;
