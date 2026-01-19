import React from 'react';
import LeftPanel from '../../../../components/Panels/LeftPanel';
import { BuilderProvider } from '../../../../contexts/BuilderContext';
import Panel from '../../../../components/Builder/Panel';
import Elements from '../../../../components/Panels/LeftPanel/Elements';
import LeftPanelOpener from '../../../../components/Panels/LeftPanel/LeftPanelOpener';

describe('LeftPanel Component', () => {
  it('Should Always Render Panel in LeftPanel', () => {
    const leftPanelWrapper = shallow(<LeftPanel {...LeftPanel.defaultProps} />);
    expect(leftPanelWrapper.find(Panel)).toHaveLength(1);
  });

  it('Should Always Render LeftPanelOpener in LeftPanel', () => {
    const leftPanelWrapper = shallow(<LeftPanel {...LeftPanel.defaultProps} />);
    expect(leftPanelWrapper.find(LeftPanelOpener)).toHaveLength(1);
  });

  it('Should Always Render Elements in LeftPanel', () => {
    const leftPanelWrapper = shallow(<LeftPanel {...LeftPanel.defaultProps} />);
    expect(leftPanelWrapper.find(Elements)).toHaveLength(1);
  });


  it('Should Not Pass isIdle Class to Panel If `isLeftPanelOpen` is `true`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <LeftPanel />
      </BuilderProvider>,
    );
    builderWrapper.setState({ isLeftPanelOpen: true });
    expect(builderWrapper.find(Panel).props().additionalClassName).not.toMatch('isIdle');
  });

  it('Should Pass isIdle Class to Panel If `isLeftPanelOpen` is `false`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <LeftPanel />
      </BuilderProvider>,
    );
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('isIdle');
  });
});
