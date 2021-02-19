import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import SettingsItemRenderer from '../../../../components/Settings/SettingsItemRenderer';

describe('SettingSettingsItemRenderer', () => {
  it('It Should Render Only Childeren Is `static` Property of `setting` Prop is True', () => {
    const setting = {
      label: 'Static',
      static: true,
      type: 'fieldSet',
      wrapperClass: 'WrapperClass',
    };

    const settingsItemRendererWrapper = shallow(<SettingsItemRenderer setting={setting} />);
    expect(settingsItemRendererWrapper.find(selectors.itemLabel)).toHaveLength(0);
  });

  it('Should Show Wrapper Class if `wrapperClass` Property of `setting` Prop Has a Value', () => {
    const setting = {
      static: false,
      wrapperClass: 'WrapperClass',
    };

    const settingsItemRendererWrapper = shallow(<SettingsItemRenderer setting={setting} />);
    expect(settingsItemRendererWrapper.find(`.${setting.wrapperClass}`)).toHaveLength(1);
  });

  it('It Should Show Label if `label` Property of `setting` Prop Has a Value', () => {
    const setting = {
      label: 'Static',
      static: false,
    };

    const settingsItemRendererWrapper = shallow(<SettingsItemRenderer setting={setting} />);
    expect(settingsItemRendererWrapper.find(selectors.itemLabel)).toHaveLength(1);
    expect(settingsItemRendererWrapper.find(selectors.itemLabel).text()).toBe(setting.label);
  });
});
