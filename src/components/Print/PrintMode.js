import { PropProvider } from '../../contexts/PropContext';
import PrintModeWithoutContext from './PrintModeWithoutContext';

import '../../styles/jfReportsBundle.scss';

const PrintMode = props => {
  return (
    <PropProvider {...props}>
      <PrintModeWithoutContext />
    </PropProvider>
  );
};

export default PrintMode;
