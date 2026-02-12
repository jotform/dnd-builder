import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { usePropStore } from '../../../contexts/PropContext';
import SettingsItemRenderer from '../../Settings/SettingsItemRenderer';
import { onChangeFunction } from '../../../utils/functions';
import ErrorBoundary from '../../ErrorBoundary';

const TestError = () => {
  throw new Error('Test error for ErrorBoundary (Settings)');
};

const Settings = ({
  element = {},
  item = {},
  onChange = () => {},
  settings = {},
  tabs = [],
}) => {
  const itemAccessor = usePropStore(state => state.itemAccessor);
  const activeTab = useBuilderStore(state => state.activeTab);
  const useExperimentalFeatures = usePropStore(state => state.useExperimentalFeatures);

  return (tabs.map((tabKey, index) => {
    return (
      <div
        key={index.toString()}
        className={classNames(
          'toolItem-tabContent',
          { hidden: index !== activeTab.right },
          { hasInnerScroll: tabKey === 'MY IMAGES' },
        )}
      >
        {settings[tabKey].map((setting, itemIndex) => {
          if (setting.experimental && !useExperimentalFeatures) {
            return null;
          }
          const customUpdaterFunction = setting.onChange ? setting.onChange : false;
          const defaultItem = element.defaultItem || {};
          const value = (item[setting.key] || item[setting.key] === 0)
            ? item[setting.key] : defaultItem[setting.key] || null;
          const computedValue = setting.value ? setting.value(value, item, itemAccessor) : value;
          const newItem = { ...defaultItem, ...item };
          return (
            <SettingsItemRenderer
              key={`${itemIndex.toString()}_${item.id}_${setting.key}_${setting.uniqueId}`}
              setting={setting}
              settingValue={computedValue}
            >
              {SettingItem => {
                return (
                  <ErrorBoundary
                    item={newItem}
                    level="settings"
                  >
                    {/* TODO: Remove - temporary error test */}
                    <TestError />
                    <SettingItem
                      config={setting}
                      item={newItem}
                      itemAccessor={itemAccessor}
                      onItemChange={onChangeFunction(
                        setting,
                        onChange,
                        newItem,
                        customUpdaterFunction,
                      )}
                      value={computedValue}
                    />
                  </ErrorBoundary>
                );
              }}
            </SettingsItemRenderer>
          );
        })}
      </div>
    );
  }));
};

Settings.propTypes = {
  element: PropTypes.shape({}),
  item: PropTypes.shape({}),
  onChange: PropTypes.func,
  settings: PropTypes.shape({}),
  tabs: PropTypes.arrayOf(PropTypes.string),
};

export default memo(Settings);
