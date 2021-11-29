import PropTypes from 'prop-types';
import objectHash from 'object-hash';
import ReportWrapper from '../ReportWrapper';
import StaticScene from './StaticScene';
import { PropProvider } from '../../utils/propContext';
import { BuilderProvider } from '../../utils/builderContext';

const Preview = ({
  acceptedItems,
  additionalPageItems,
  itemAccessor,
  lastScrollPosition,
  onAnEventTrigger,
  pages,
  settings,
  theme,
  ...otherProps
}) => {
/* eslint-disable no-unused-vars */
  const {
    disableInteraction,
    leftPanelConfig,
    onItemAdd,
    onItemChange,
    onItemMove,
    onItemRemove,
    onItemResize,
    onItemsMove,
    onPageAdd,
    onPageChange,
    onPageDuplicate,
    onPageOrdersChange,
    onPageRemove,
    onSettingChange,
    useExperimentalFeatures,
    ...hashProps
  } = otherProps;
  /* eslint-enable no-unused-vars */

  const hashCode = objectHash(hashProps);

  return (
    <BuilderProvider>
      <PropProvider
        acceptedItems={acceptedItems}
        onAnEventTrigger={onAnEventTrigger}
        settings={settings}
      >
        <ReportWrapper
          mode="preview"
          theme={theme}
        >
          <StaticScene
            additionalPageItems={additionalPageItems}
            hashCode={hashCode}
            isExistsZoom
            itemAccessor={itemAccessor}
            lastScrollPosition={lastScrollPosition}
            pages={pages}
          />
        </ReportWrapper>
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
  lastScrollPosition: PropTypes.number,
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

Preview.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  itemAccessor: () => {},
  lastScrollPosition: 0,
  onAnEventTrigger: () => {},
  pages: [],
  settings: {},
  theme: 'lightMode',
};

export default Preview;
