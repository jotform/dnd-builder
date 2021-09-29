import { Fragment, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useBuilderContext } from '../../utils/builderContext';
import { usePropContext } from '../../utils/propContext';

const Tabs = ({ panel, tabs }) => {
  const {
    activeTab,
    isLeftPanelOpen,
    isRightPanelOpen,
    setActiveTab,
  } = useBuilderContext();
  const {
    onAnEventTrigger,
  } = usePropContext();

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
                className="t-medium js-tabLabel"
                htmlFor={tab}
              >
                {tab}
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

Tabs.defaultProps = {
  tabs: [],
};

export default memo(Tabs);
