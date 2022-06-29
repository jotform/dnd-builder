import React from 'react';
import RightPanel from '../../../../components/Panels/RightPanel';
import Panel from '../../../../components/Builder/Panel';
import RightPanelToggler from '../../../../components/Panels/RightPanel/RightPanelToggler';
import Section from '../../../../components/Builder/Section';
import Tabs from '.../../../../components/Builder/Tabs';
import Settings from '../../../../components/Panels/RightPanel/Settings';
import { BuilderProvider } from '../../../../utils/builderContext';


describe('RightPanel Component', () => {
  it('Should Always Render Panel in RightPanel', () => {
    const rightPanelWrapper = shallow(<RightPanel />);
    expect(rightPanelWrapper.find(Panel)).toHaveLength(1);
  });

  it('Should Always Render RightPanelToggler in RightPanel', () => {
    const rightPanelWrapper = shallow(<RightPanel />);
    expect(rightPanelWrapper.find(RightPanelToggler)).toHaveLength(1);
  });

  it('Should Always Render Section in RightPanel', () => {
    const rightPanelWrapper = shallow(<RightPanel />);
    expect(rightPanelWrapper.find(Section)).toHaveLength(1);
  });

  it('Should Always Render Tabs in RightPanel', () => {
    const rightPanelWrapper = shallow(<RightPanel />);
    expect(rightPanelWrapper.find(Tabs)).toHaveLength(1);
  });

  it('Should Always Render Settings in RightPanel', () => {
    const rightPanelWrapper = shallow(<RightPanel />);
    expect(rightPanelWrapper.find(Settings)).toHaveLength(1);
  });

  it('Section contains Tabs & Settings', () => {
    const rightPanelWrapper = shallow(<RightPanel />);
    expect(rightPanelWrapper.find(Tabs).parent().is(Section)).toEqual(true);
    expect(rightPanelWrapper.find(Settings).parent().is(Section)).toEqual(true);
  });

  it('Should Not Pass isIdle Class to Panel If `isRightPanelOpen` is `true`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <RightPanel />
      </BuilderProvider>,
    );
    builderWrapper.setState({ isRightPanelOpen: true });
    expect(builderWrapper.find(Panel).props().additionalClassName).not.toMatch('isIdle');
  });

  it('Should Pass isIdle Class to Panel If `isRightPanelOpen` is `false`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <RightPanel />
      </BuilderProvider>,
    );
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('isIdle');
  });

  it('Should Not Pass otherOpened Class to Panel If `isSlidesPanelOpen` is `false`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <RightPanel />
      </BuilderProvider>,
    );
    expect(builderWrapper.find(Panel).props().additionalClassName).not.toMatch('otherOpened');
  });

  it('Should Pass otherOpened Class to Panel If `isSlidesPanelOpen` is `true`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <RightPanel />
      </BuilderProvider>,
    );
    builderWrapper.setState({ isSlidesPanelOpen: true });
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('otherOpened');
  });

  it('Should Render `RightPanelToggler` with `paneClose` class name If `isRightPanelOpen` is `true`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
      isRightPanelOpen: true
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <RightPanel />
      </BuilderProvider>,
    );
    expect(builderWrapper.find('.paneClose')).toHaveLength(1);
  });

  it('Should Not Render `RightPanelToggler` If `isSlidesPanelOpen` is `true`', () => {
    const props = {
      ...BuilderProvider.defaultProps,
      isSlidesPanelOpen: true
    };
    const builderWrapper = mount(
      <BuilderProvider {...props}>
        <RightPanel />
      </BuilderProvider>,
    );
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('isIdle');
    expect(builderWrapper.find(RightPanelToggler)).toHaveLength(0);
  });
});
