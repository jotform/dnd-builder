import PropTypes from 'prop-types';
import objectHash from 'object-hash';
import { PresentationProvider } from '../../utils/presentationContext';
import { BuilderProvider } from '../../utils/builderContext';
import { PropProvider } from '../../utils/propContext';
import StaticScene from '../Preview/StaticScene';
import ReportWrapper from '../ReportWrapper';
import PresentationWrapper from './PresentationWrapper';

import '../../styles/jfReportsBundle.scss';
import Print from '../Print';

const Presentation = ({
  acceptedItems,
  additionalPageItems,
  itemAccessor,
  onAnEventTrigger,
  pages,
  presentationBarActions,
  settings,
  theme,
  useFixedPresentationBar,
  ...otherProps
}) => {
  const hashCode = objectHash(otherProps);

  return (
    <PresentationProvider
      pageCount={pages.length}
    >
      <PropProvider
        acceptedItems={acceptedItems}
        onAnEventTrigger={onAnEventTrigger}
        settings={settings}
      >
        <BuilderProvider>
          <ReportWrapper
            mode="presentation"
            theme={theme}
          >
            <PresentationWrapper
              presentationBarActions={presentationBarActions}
              useFixedPresentationBar={useFixedPresentationBar}
            >
              {(presentationPage, gesture) => (
                <StaticScene
                  additionalPageItems={additionalPageItems}
                  gesture={gesture}
                  hashCode={hashCode}
                  hideZoom={true}
                  itemAccessor={itemAccessor}
                  pages={pages}
                  presentationPage={presentationPage}
                />
              )}
            </PresentationWrapper>
            <Print
              additionalPageItems={additionalPageItems}
              itemAccessor={itemAccessor}
              pages={pages}
              settings={settings}
              {...otherProps}
            />
          </ReportWrapper>
        </BuilderProvider>
      </PropProvider>
    </PresentationProvider>
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

Presentation.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  itemAccessor: () => {},
  onAnEventTrigger: () => {},
  pages: [],
  presentationBarActions: [],
  settings: {},
  theme: 'lightMode',
  useFixedPresentationBar: false,
};

export default Presentation;
