import { Fragment, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useBuilderContext } from '../../../utils/builderContext';
import { usePropContext } from '../../../utils/propContext';

const SettingTabs = ({ tabs }) => {
  const {
    activeTab,
    setActiveTab,
  } = useBuilderContext();
  const {
    onAnEventTrigger,
  } = usePropContext();

  const setCurrentTab = useCallback((index, tab) => {
    setActiveTab(index);
    onAnEventTrigger('settingTabChanged', tab);
  }, [setActiveTab, onAnEventTrigger]);

  return (
    tabs.length > 1 && (
      <div
        className="toolTabs d-flex p-relative"
        data-tab={tabs.length}
      >
        { tabs.map((tab, index) => (
          <Fragment key={index.toString()}>
            <input
              checked={activeTab === index}
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
        ))}
        <div
          className="toolTabs-indicator p-absolute bg-blue"
          data-tab={tabs.length}
        />
      </div>
    )
  );
};

SettingTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
};

SettingTabs.defaultProps = {
  tabs: [],
};

export default memo(SettingTabs);
