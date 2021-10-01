import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useBuilderContext } from '../../../utils/builderContext';
import { usePropContext } from '../../../utils/propContext';
import SettingsItemRenderer from '../../Settings/SettingsItemRenderer';
import { onChangeFunction } from '../../../utils/functions';
import ErrorBoundary from '../../ErrorBoundary';

const Settings = ({
  element,
  item,
  itemAccessor,
  onChange,
  settings,
  tabs,
}) => {
  const { activeTab } = useBuilderContext();
  const { useExperimentalFeatures } = usePropContext();
  return (tabs.map((tabKey, index) => {
    return (
      <div
        key={index.toString()}
        className={classNames(
          'toolItem-tabContent',
          { hidden: index !== activeTab.right },
          { hasInnerScroll: tabKey === 'My Images' },
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
                  <ErrorBoundary>
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

Settings.defaultProps = {
  element: {},
  item: {},
  onChange: () => {},
  settings: {},
  tabs: [],
};

export default memo(Settings);
