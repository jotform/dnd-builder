import PropTypes from 'prop-types';
import { BuilderProvider } from './BuilderContext';
import { PresentationProvider } from './PresentationContext';
import { PropProvider } from './PropContext';

const Providers = ({
  children,
  lastScrollPosition,
  mode,
  onRightPanelsToggled,
  presentationBarActions,
  useFixedPresentationBar,
  ...props
}) => {
  return (
    <BuilderProvider
      lastScrollPosition={lastScrollPosition}
      onRightPanelsToggled={onRightPanelsToggled}
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
  useFixedPresentationBar: PropTypes.bool,
};

export default Providers;
