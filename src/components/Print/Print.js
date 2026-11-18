import PropTypes from 'prop-types';
import PrintWrapper from './PrintWrapper';
import Providers from '../../contexts/Providers';
import ReportWrapper from '../ReportWrapper';
import StaticScene from '../Preview/StaticScene';

import '../../styles/jfReportsBundle.scss';

const Print = props => {
  return (
    <Providers
      mode="print"
      {...props}
    >
      <PrintWrapper>
        <ReportWrapper mode="print">
          <StaticScene
            hideZoom={true}
            mode="print"
          />
        </ReportWrapper>
      </PrintWrapper>
    </Providers>
  );
};

Print.propTypes = {
  acceptedItems: PropTypes.shape({}),
  pages: PropTypes.arrayOf(PropTypes.object),
  settings: PropTypes.shape({}),
  theme: PropTypes.oneOf(['lightMode', 'darkMode']),
};

export default Print;
