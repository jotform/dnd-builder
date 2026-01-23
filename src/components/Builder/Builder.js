import PropTypes from 'prop-types';
import DndWrapper from './DndWrapper';
import Scene from './Scene';
import RightPanel from '../Panels/RightPanel';
import LeftPanel from '../Panels/LeftPanel';
import SlidesPanel from '../Panels/SlidesPanel';
import AllSlidesPanel from '../Panels/AllSlidesPanel';
import { leftPanelConfigPropType } from '../../constants/propTypes';
import '../../styles/jfReportsBundle.scss';
import BuilderWrapper from './BuilderWrapper';
import Providers from '../../contexts/Providers';

const Builder = props => {
  const { useExperimentalFeatures } = props;
  return (
    <Providers
      mode="customize"
      {...props}
    >
      <BuilderWrapper>
        <DndWrapper>
          <LeftPanel />
          <Scene />
        </DndWrapper>
        <RightPanel />
        <SlidesPanel />
        {useExperimentalFeatures && (
          <AllSlidesPanel />
        )}
      </BuilderWrapper>
    </Providers>

  );
};

Builder.propTypes = {
  /** Items for to render in the report */
  acceptedItems: PropTypes.shape({}),
  /** Array of React components to render statically on each page (eg. watermark) */
  additionalPageItems: PropTypes.arrayOf(PropTypes.node),
  disableInteraction: PropTypes.arrayOf(PropTypes.string),
  /** To pass in extra props to items selectively */
  itemAccessor: PropTypes.func,
  /** Last scroll position */
  lastScrollPosition: PropTypes.number,
  leftPanelConfig: leftPanelConfigPropType,
  /** To track and log user actions */
  onAnEventTrigger: PropTypes.func,
  /** Function called upon adding an item */
  onItemAdd: PropTypes.func,
  /** Function called upon editing an item */
  onItemChange: PropTypes.func,
  /** Function called upon moving an item */
  onItemMove: PropTypes.func,
  /** Function called upon removing an item */
  onItemRemove: PropTypes.func,
  /** Function called upon resizing an item */
  onItemResize: PropTypes.func,
  onItemsMove: PropTypes.func,
  /** Function called upon adding a page */
  onPageAdd: PropTypes.func,
  /** Function called upon editing a page */
  onPageChange: PropTypes.func,
  /** Function called upon duplicating a page */
  onPageDuplicate: PropTypes.func,
  /** Function called upon reordering pages */
  onPageOrdersChange: PropTypes.func,
  /** Function called upon removing a page */
  onPageRemove: PropTypes.func,
  /** Function called when the slides or the right panel is
   * toggled takes a boolean value to indicate whether or
   * not the panel is toggled open.
   */
  onRightPanelsToggled: PropTypes.func,
  /** Function called upon editing a general report setting */
  onSettingChange: PropTypes.func,
  /** Array of pages with their settings and items */
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  /** General report settings such as layout size and background color */
  settings: PropTypes.shape({}),
  /** Theme */
  theme: PropTypes.oneOf(['lightMode', 'darkMode']),
  useExperimentalFeatures: PropTypes.bool,
};

export default Builder;
