/* eslint-disable sort-keys */
import { StrictMode } from 'react';
import PropTypes from 'prop-types';
import objectHash from 'object-hash';
import DndWrapper from './DndWrapper';
import { BuilderProvider } from '../../utils/builderContext';
import { PropProvider } from '../../utils/propContext';
import ReportWrapper from '../ReportWrapper';
import Scene from './Scene';
import SlidesPanel from '../Panels/SlidesPanel';
import AllSlidesPanel from '../Panels/AllSlidesPanel';
import NewLeftPanel from './NewLeftPanel';
import { leftPanelConfigPropType } from '../../constants/propTypes';

import 'intersection-observer';
import '../../styles/jfReportsBundle.scss';

const Builder = ({
  acceptedItems,
  additionalPageItems,
  disableInteraction,
  isAiGenerationLoading,
  itemAccessor,
  lastScrollPosition,
  leftPanelConfig,
  onAIGenerate,
  onAnEventTrigger,
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
  onRightPanelsToggled,
  onSettingChange,
  pages,
  settings,
  theme,
  useExperimentalFeatures,
  ...otherProps
}) => {
  const hashCode = objectHash(otherProps);

  return (
    <StrictMode>
      <BuilderProvider onRightPanelsToggled={onRightPanelsToggled}>
        <PropProvider
          acceptedItems={acceptedItems}
          disableInteraction={disableInteraction}
          onAnEventTrigger={onAnEventTrigger}
          settings={settings}
          useExperimentalFeatures={useExperimentalFeatures}
        >
          <ReportWrapper
            mode="customize"
            pageCount={pages.length}
            theme={theme}
          >
            <NewLeftPanel
              onItemAdd={onItemAdd}
              onSettingChange={onSettingChange}
            />
            <DndWrapper>
              <Scene
                additionalPageItems={additionalPageItems}
                hashCode={hashCode}
                isAiGenerationLoading={isAiGenerationLoading}
                itemAccessor={itemAccessor}
                lastScrollPosition={lastScrollPosition}
                onAIGenerate={onAIGenerate}
                onItemAdd={onItemAdd}
                onItemChange={onItemChange}
                onItemMove={onItemMove}
                onItemRemove={onItemRemove}
                onItemResize={onItemResize}
                onItemsMove={onItemsMove}
                onPageAdd={onPageAdd}
                onPageChange={onPageChange}
                onPageDuplicate={onPageDuplicate}
                onPageOrdersChange={onPageOrdersChange}
                onPageRemove={onPageRemove}
                onSettingChange={onSettingChange}
                pages={pages}
                settings={settings}
              />
            </DndWrapper>
            <SlidesPanel
              additionalPageItems={additionalPageItems}
              hashCode={hashCode}
              itemAccessor={itemAccessor}
              onPageAdd={onPageAdd}
              onPageDuplicate={onPageDuplicate}
              onPageOrdersChange={onPageOrdersChange}
              onPageRemove={onPageRemove}
              pages={pages}
            />
            {useExperimentalFeatures && (
              <AllSlidesPanel
                additionalPageItems={additionalPageItems}
                hashCode={hashCode}
                itemAccessor={itemAccessor}
                onPageAdd={onPageAdd}
                onPageDuplicate={onPageDuplicate}
                onPageOrdersChange={onPageOrdersChange}
                onPageRemove={onPageRemove}
                pages={pages}
              />
            )}
          </ReportWrapper>
        </PropProvider>
      </BuilderProvider>
    </StrictMode>
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
  onAIGenerate: PropTypes.func,
  isAiGenerationLoading: PropTypes.bool,
};

Builder.defaultProps = {
  acceptedItems: {},
  additionalPageItems: [],
  disableInteraction: [],
  itemAccessor: () => { },
  lastScrollPosition: 0,
  leftPanelConfig: [],
  onAnEventTrigger: () => { },
  onItemAdd: () => { },
  onItemChange: () => { },
  onItemMove: () => { },
  onItemRemove: () => { },
  onItemResize: () => { },
  onItemsMove: () => { },
  onPageAdd: () => { },
  onPageChange: () => { },
  onPageDuplicate: () => { },
  onPageOrdersChange: () => { },
  onPageRemove: () => { },
  onRightPanelsToggled: () => { },
  onSettingChange: () => { },
  pages: [],
  settings: {},
  theme: 'lightMode',
  useExperimentalFeatures: false,
  onAIGenerate: () => { },
  isAiGenerationLoading: false,
};

export default Builder;
