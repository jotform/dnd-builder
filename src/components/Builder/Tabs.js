import { Fragment, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';

const Tabs = ({ panel, tabs = [] }) => {
  const activeTab = useBuilderStore(state => state.activeTab);
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const setActiveTab = useBuilderStore(state => state.setActiveTab);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);

  const setCurrentTab = useCallback((index, tab) => {
    setActiveTab(panel, index);
    onAnEventTrigger('settingTabChanged', tab);
  }, [setActiveTab, onAnEventTrigger, panel]);

  return (
    tabs.length > 1 && (
      <div
        className={`toolTabs d-flex p-relative ${panel}`}
        data-tab={tabs.length}
      >
        { tabs.map((tab, index) => {
          const checked = activeTab[panel] === index
            && ((panel === 'left' && isLeftPanelOpen) || (panel === 'right' && isRightPanelOpen));
          return (
            <Fragment key={tab}>
              <input
                checked={checked}
                className="toolTabs-tab"
                id={tab}
                name="tabs"
                onChange={() => setCurrentTab(index, tab)}
                tab-count={index}
                type="radio"
              />
              <label
                className="t-normal js-tabLabel"
                htmlFor={tab}
              >
                <span>
                  {tab}
                </span>
              </label>
            </Fragment>
          );
        })}
        <div
          className="toolTabs-indicator p-absolute"
          data-tab={tabs.length}
        />
      </div>
    )
  );
};

Tabs.propTypes = {
  panel: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string),
};

export default memo(Tabs);
