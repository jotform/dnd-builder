import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import Tabs from '../../../../components/Builder/Tabs';
import { BuilderProvider } from '../../../../contexts/BuilderContext';

describe('SettingTabs', () => {
  it('Should Render Tab Sections If `tabs` Prop Contains More Than 1 Element', () => {
    const settingTabWrapper = shallow(<Tabs tabs={['HEADER', 'LINE', 'SUBHEADER']} />);
    expect(settingTabWrapper.find(selectors.toolTabsTab)).toHaveLength(3);
  });

  it('Should Not Render Tab Sections If `tabs` Prop Contains Less Than 2 Element', () => {
    const settingTabWrapper = shallow(<Tabs tabs={['GENERAL']} />);
    expect(settingTabWrapper.find(selectors.tabLabel)).toHaveLength(0);
    expect(settingTabWrapper.find(selectors.toolTabsTab)).toHaveLength(0);
  });

  it('Should Change Tabs Properly', () => {
    const settingTabWrapper = mount(
      <BuilderProvider
        isRightPanelOpen={true}
      >
        <Tabs
          panel="right"
          tabs={['HEADER', 'LINE', 'SUBHEADER']}
        />
      </BuilderProvider>,
    );

    settingTabWrapper.find('#LINE').simulate('change', { target: { checked: true } });
    expect(settingTabWrapper.find('#LINE').props().checked).toBe(true);
  });

  it('Should Call setActiveTab Once Click on a Tab', () => {
    const eventMock = jest.fn();
    const settingTabWrapper = mount(
      <BuilderProvider>
        <Tabs tabs={['HEADER', 'LINE', 'SUBHEADER']} />
      </BuilderProvider>,
    );
    settingTabWrapper.setState({ setActiveTab: eventMock });

    settingTabWrapper.find('#SUBHEADER').simulate('change');
    expect(eventMock).toHaveBeenCalledTimes(1);
  });

  it('Should Pass `tabs` Prop Values as Tab Label', () => {
    const settingTabWrapper = shallow(<Tabs tabs={['HEADER', 'LINE', 'SUBHEADER']} />);
    const tabs = settingTabWrapper.find(selectors.tabLabel);
    expect(tabs.at(0).text()).toBe('HEADER');
    expect(tabs.at(1).text()).toBe('LINE');
    expect(tabs.at(2).text()).toBe('SUBHEADER');
  });
});
