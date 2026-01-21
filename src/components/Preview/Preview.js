import PropTypes from 'prop-types';
import ReportWrapper from '../ReportWrapper';
import StaticScene from './StaticScene';
import { PropProvider } from '../../contexts/PropContext';
import { BuilderProvider } from '../../contexts/BuilderContext';
import { PresentationProvider } from '../../contexts/PresentationContext';

const Preview = props => {
  return (
    <BuilderProvider>
      <PropProvider {...props}>
        <PresentationProvider>
          <ReportWrapper mode="preview">
            <StaticScene
              isExistsZoom
              mode="preview"
            />
          </ReportWrapper>
        </PresentationProvider>
      </PropProvider>
    </BuilderProvider>
  );
};

Preview.propTypes = {
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
  /** General report settings such as layout size and background color */
  settings: PropTypes.shape({}),
  /** Theme */
  theme: PropTypes.oneOf(['lightMode', 'darkMode']),
};

export default Preview;
