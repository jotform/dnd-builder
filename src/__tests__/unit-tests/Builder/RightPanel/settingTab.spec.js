import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import SettingTabs from '../../../../components/Panels/RightPanel/SettingTabs';
import { BuilderProvider } from '../../../../utils/builderContext';

describe('SettingTabs', () => {
  it('Should Render Tab Sections If `tabs` Prop Contains More Than 1 Element', () => {
    const props = {
      ...SettingTabs.defaultProps,
      tabs: ['Header', 'Line', 'Subheader'],
    };
    const settingTabWrapper = shallow(<SettingTabs {...props} />);
    expect(settingTabWrapper.find(selectors.toolTabsTab)).toHaveLength(props.tabs.length);
  });

  it('Should Not Render Tab Sections If `tabs` Prop Contains Less Than 2 Element', () => {
    const props = {
      ...SettingTabs.defaultProps,
      tabs: ['General'],
    };
    const settingTabWrapper = shallow(<SettingTabs {...props} />);
    expect(settingTabWrapper.find(selectors.tabLabel)).toHaveLength(0);
    expect(settingTabWrapper.find(selectors.toolTabsTab)).toHaveLength(0);
  });

  it('Should Change Tabs Properly', () => {
    const props = {
      ...SettingTabs.defaultProps,
      tabs: ['Header', 'Line', 'Subheader'],
    };
    const settingTabWrapper = mount(
      <BuilderProvider>
        <SettingTabs {...props} />
      </BuilderProvider>,
    );

    settingTabWrapper.find(`#${props.tabs[1]}`).simulate('change', { target: { checked: true } });
    expect(settingTabWrapper.find(`#${props.tabs[1]}`).props().checked).toBe(true);
  });

  it('Should Call setActiveTab Once Click on a Tab', () => {
    const eventMock = jest.fn();
    const props = {
      ...SettingTabs.defaultProps,
      tabs: ['Header', 'Line', 'Subheader'],
    };
    const settingTabWrapper = mount(
      <BuilderProvider>
        <SettingTabs {...props} />
      </BuilderProvider>,
    );
    settingTabWrapper.setState({ setActiveTab: eventMock });

    settingTabWrapper.find(`#${props.tabs[2]}`).simulate('change');
    expect(eventMock).toHaveBeenCalledTimes(1);
  });

  it('Should Pass `tabs` Prop Values as Tab Label', () => {
    const props = {
      ...SettingTabs.defaultProps,
      tabs: ['Header', 'Line', 'Subheader'],
    };
    const settingTabWrapper = shallow(<SettingTabs {...props} />);
    const tabs = settingTabWrapper.find(selectors.tabLabel);
    expect(tabs.at(0).text()).toBe(props.tabs[0]);
    expect(tabs.at(1).text()).toBe(props.tabs[1]);
    expect(tabs.at(2).text()).toBe(props.tabs[2]);
  });
});
