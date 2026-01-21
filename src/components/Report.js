import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Builder from './Builder';
import Presentation from './Presentation/Presentation';
import Preview from './Preview';
import Print from './Print';
import reportsAppTexts, { SharingTextsModule } from '../constants/texts';

const modeComponents = {
  customize: Builder,
  presentation: Presentation,
  preview: Preview,
  print: Print,
};

const Report = ({
  mode = 'customize',
  reportsAppTexts: newReportsAppTexts = reportsAppTexts,
  ...props
}) => {
  const [viewMode, setViewMode] = useState(mode);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    SharingTextsModule.setTexts(newReportsAppTexts);
  }, [newReportsAppTexts]);

  useEffect(() => {
    if (['customize', 'preview'].indexOf(viewMode) > -1) {
      setLastScrollPosition(document.querySelector('.jfReport-viewport')?.scrollTop || 0);
    }
    setViewMode(mode);
  }, [mode, viewMode]);

  const Component = useMemo(() => modeComponents[viewMode], [viewMode]);

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...props}
      lastScrollPosition={lastScrollPosition}
    />
  );
};

Report.propTypes = {
  /** Conditionally rendering different modes  */
  mode: PropTypes.oneOf(['customize', 'preview', 'print', 'presentation']),
  /**
   It can be changed static texts or translated which use in the library.
   New texts are set when you pass again.
  */
  reportsAppTexts: PropTypes.shape({}),
};

export default Report;
