import { PropProvider } from '../../contexts/PropContext';
import PrintModeWithoutContext from './PrintModeWithoutContext';

import '../../styles/jfReportsBundle.scss';
import { PresentationProvider } from '../../contexts/PresentationContext';

const PrintMode = props => {
  return (
    <PropProvider {...props}>
      <PresentationProvider>
        <PrintModeWithoutContext />
      </PresentationProvider>
    </PropProvider>
  );
};

export default PrintMode;
