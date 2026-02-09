import { Fragment, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropStore } from '../../contexts/PropContext';

const Tabs = ({ panel, tabs = [] }) => {
  const activeTab = useBuilderStore(state => state.activeTab);
  const setActiveTab = useBuilderStore(state => state.setActiveTab);
  const onAnEventTrigger = usePropStore(state => state.onAnEventTrigger);

  const setCurrentTab = useCallback(index => () => {
    setActiveTab(panel, index);
    onAnEventTrigger('settingTabChanged', tabs[index]);
  }, [setActiveTab, onAnEventTrigger, panel, tabs]);

  return (
    tabs.length > 1 && (
      <div
        className={`toolTabs d-flex p-relative ${panel}`}
        data-tab={tabs.length}
      >
        {tabs.map((tab, index) => {
          const inputId = `tabs-${panel}-${index}`;
          return (
            <Fragment key={inputId}>
              <input
                checked={activeTab[panel] === index}
                className={`toolTabs-tab ${panel}`}
                id={inputId}
                name={`tabs-${panel}`}
                onChange={setCurrentTab(index)}
                tab-count={index}
                type="radio"
              />
              <label
                className="t-normal js-tabLabel"
                htmlFor={inputId}
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
