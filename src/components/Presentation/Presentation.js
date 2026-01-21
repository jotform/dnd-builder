import PropTypes from 'prop-types';
import { PresentationProvider } from '../../contexts/PresentationContext';
import { BuilderProvider } from '../../contexts/BuilderContext';
import { PropProvider } from '../../contexts/PropContext';
import StaticScene from '../Preview/StaticScene';
import ReportWrapper from '../ReportWrapper';
import PresentationWrapper from './PresentationWrapper';

import '../../styles/jfReportsBundle.scss';
import Print from '../Print';

const Presentation = ({
  presentationBarActions = [],
  useFixedPresentationBar = false,
  ...props
}) => {
  return (
    <BuilderProvider>
      <PropProvider {...props}>
        <PresentationProvider
          presentationBarActions={presentationBarActions}
          useFixedPresentationBar={useFixedPresentationBar}
        >
          <ReportWrapper mode="presentation">
            <PresentationWrapper>
              {(presentationPage, gesture) => (
                <StaticScene
                  gesture={gesture}
                  hideZoom={true}
                  mode="presentation"
                  presentationPage={presentationPage}
                />
              )}
            </PresentationWrapper>
            <Print />
          </ReportWrapper>
        </PresentationProvider>
      </PropProvider>
    </BuilderProvider>
  );
};

Presentation.propTypes = {
  /** Items for to render in the report */
  acceptedItems: PropTypes.shape({}),
  /** Array of React components to render statically on each page (eg. watermark) */
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  /** To pass in extra props to items selectively */
  itemAccessor: PropTypes.func,
  onAnEventTrigger: PropTypes.func,
  /** Array of pages with their settings and items */
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  /** To pass in action definitions that will be rendered as buttons */
  presentationBarActions: PropTypes.arrayOf(PropTypes.shape({})),
  /** General report settings such as layout size and background color */
  settings: PropTypes.shape({}),
  /** Theme */
  theme: PropTypes.oneOf(['lightMode', 'darkMode']),
  /** Flag for fixed action bar */
  useFixedPresentationBar: PropTypes.bool,
};

export default Presentation;
