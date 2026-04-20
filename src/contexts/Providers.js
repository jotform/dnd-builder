import PropTypes from 'prop-types';
import { BuilderProvider } from './BuilderContext';
import { PresentationProvider } from './PresentationContext';
import { PropProvider } from './PropContext';
import { SLIDES_LIST_TYPE_MAP } from '../constants/panel';

const Providers = ({
  children,
  clickOutsideIgnoreSelectors,
  defaultZoom,
  lastScrollPosition,
  mode,
  onRightPanelsToggled,
  presentationBarActions,
  shouldShowRightPanelInitially,
  slidesListType,
  useFixedPresentationBar,
  ...props
}) => {
  return (
    <BuilderProvider
      clickOutsideIgnoreSelectors={clickOutsideIgnoreSelectors}
      defaultZoom={defaultZoom}
      lastScrollPosition={lastScrollPosition}
      onRightPanelsToggled={onRightPanelsToggled}
      shouldShowRightPanelInitially={shouldShowRightPanelInitially}
      slidesListType={slidesListType}
    >
      <PropProvider {...props}>
        {mode === 'customize' ? children : (
          <PresentationProvider
            presentationBarActions={presentationBarActions}
            useFixedPresentationBar={useFixedPresentationBar}
          >
            {children}
          </PresentationProvider>
        )}
      </PropProvider>
    </BuilderProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  /** CSS selectors ignored by right panel click-outside logic */
  clickOutsideIgnoreSelectors: PropTypes.arrayOf(PropTypes.string),
  /** Default zoom */
  defaultZoom: PropTypes.number,
  /** Last scroll position */
  lastScrollPosition: PropTypes.number,
  /** Mode of the report */
  mode: PropTypes.oneOf(['customize', 'presentation', 'preview', 'print']),
  /** Function called when the slides or the right panel is
   * toggled takes a boolean value to indicate whether or
   * not the panel is toggled open.
   */
  onRightPanelsToggled: PropTypes.func,
  /** To pass in action definitions that will be rendered as buttons */
  presentationBarActions: PropTypes.arrayOf(PropTypes.shape({})),
  /** Flag for fixed action bar */
  shouldShowRightPanelInitially: PropTypes.bool,
  /** Flag for whether to show the right panel initially */
  slidesListType: PropTypes.oneOf(Object.values(SLIDES_LIST_TYPE_MAP)),
  /** Slides list type for the report */
  useFixedPresentationBar: PropTypes.bool,
};

export default Providers;
