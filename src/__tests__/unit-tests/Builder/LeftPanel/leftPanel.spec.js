import React from 'react';
import LeftPanel from '../../../../components/Panels/LeftPanel';
import Panel from '../../../../components/Builder/Panel';
import Elements from '../../../../components/Panels/LeftPanel/Elements';
import LeftPanelOpener from '../../../../components/Panels/LeftPanel/LeftPanelOpener';
import { mountWithProviders } from '../../../../__test_helpers__/utils';

describe('LeftPanel Component', () => {
  it('Should Always Render Panel in LeftPanel', () => {
    const leftPanelWrapper = mountWithProviders(<LeftPanel />);
    expect(leftPanelWrapper.find(Panel)).toHaveLength(1);
  });

  it('Should Always Render LeftPanelOpener in LeftPanel', () => {
    const leftPanelWrapper = mountWithProviders(<LeftPanel />);
    expect(leftPanelWrapper.find(LeftPanelOpener)).toHaveLength(1);
  });

  it('Should Always Render Elements in LeftPanel', () => {
    const leftPanelWrapper = mountWithProviders(<LeftPanel />);
    expect(leftPanelWrapper.find(Elements)).toHaveLength(1);
  });


  it('Should Not Pass isIdle Class to Panel If `isLeftPanelOpen` is `true`', () => {
    const builderWrapper = mountWithProviders(<LeftPanel />, { builderProps: { isLeftPanelOpen: true } });
    expect(builderWrapper.find(Panel).props().additionalClassName).not.toMatch('isIdle');
  });

  it('Should Pass isIdle Class to Panel If `isLeftPanelOpen` is `false`', () => {
    const builderWrapper = mountWithProviders(<LeftPanel />, { builderProps: { isLeftPanelOpen: false } });
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('isIdle');
  });
});
