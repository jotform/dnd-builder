import React from 'react';
import { selectors, settings } from '../../../../__test_helpers__/constants';
import Settings from '../../../../components/Panels/RightPanel/Settings';
import SettingsItemRenderer from '../../../../components/Settings/SettingsItemRenderer';
import { BuilderProvider } from '../../../../contexts/BuilderContext';
import { mountWithProviders } from '../../../../__test_helpers__/utils';

describe('Settings', () => {
  it('Unselected Tabs Should Contain `hidden` Class', () => {
    const props = {
      settings: settings.headerSettings,
      tabs: ['HEADER', 'LINE', 'SUBHEADER'],
    };

    const settingsWrapper = mountWithProviders(<Settings {...props} />);
    const unselectedTabs = settingsWrapper.find(selectors.hidden);
    expect(unselectedTabs).toHaveLength(props.tabs.length - 1);
  });

  it('Should Contain `hasInnerScroll`Class If `tabs` Prop Contain `My Image` Key', () => {
    const props = {
      settings: settings.imageSettings,
      tabs: ['ENTER URL', 'MY IMAGES', 'UPLOAD'],
    };

    const settingsWrapper = mountWithProviders(<Settings {...props} />);
    const tabHavingInnerScroll = settingsWrapper.find(selectors.hasInnerScroll);
    expect(tabHavingInnerScroll).toHaveLength(1);
  });

  it('Not Contain `hidden`&`hasInnerScroll` If`tabs` Not Contain `My Image` Key &Length <2', () => {
    const props = {
      settings: settings.layoutSettings,
      tabs: ['GENERAL'],
    };
    const settingsWrapper = mountWithProviders(<Settings {...props} />);

    const tabHavingInnerScroll = settingsWrapper.find(selectors.hasInnerScroll);
    expect(tabHavingInnerScroll).toHaveLength(0);
    const unselectedTabs = settingsWrapper.find(selectors.hidden);
    expect(unselectedTabs).toHaveLength(0);
  });

  it('Should Render SettingsItemRenderer According To `settings` Prop', () => {
    const props = {
      settings: settings.headerSettings,
      tabs: ['HEADER', 'LINE', 'SUBHEADER'],
    };
    const settingsWrapper = mountWithProviders(<Settings {...props} />);
    const totalLength = (
      settings.headerSettings[props.tabs[0]].length
      + settings.headerSettings[props.tabs[1]].length
      + settings.headerSettings[props.tabs[2]].length);

    const settingsItemRenderer = settingsWrapper.find(SettingsItemRenderer);
    expect(settingsItemRenderer).toHaveLength(totalLength);
  });
});
