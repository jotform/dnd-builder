import {
  useState, useEffect, useMemo, StrictMode,
} from 'react';
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
    if (viewMode === 'customize') {
      setLastScrollPosition(document.querySelector('.jfReport-viewport')?.scrollTop || 0);
    }
    setViewMode(mode);
  }, [mode, viewMode]);

  const ModeComponent = useMemo(() => modeComponents[viewMode], [viewMode]);

  if (!ModeComponent) {
    return null;
  }

  return (
    <StrictMode>
      <ModeComponent
        {...props}
        lastScrollPosition={lastScrollPosition}
      />
    </StrictMode>
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
