import React from 'react';
import RightPanel from '../../../../components/Panels/RightPanel';
import Panel from '../../../../components/Builder/Panel';
import RightPanelToggler from '../../../../components/Panels/RightPanel/RightPanelToggler';
import Section from '../../../../components/Builder/Section';
import Tabs from '.../../../../components/Builder/Tabs';
import Settings from '../../../../components/Panels/RightPanel/Settings';
import { mountWithProviders } from '../../../../__test_helpers__/utils';


describe('RightPanel Component', () => {
  it('Should Always Render Panel in RightPanel', () => {
    const rightPanelWrapper = mountWithProviders(<RightPanel />);
    expect(rightPanelWrapper.find(Panel)).toHaveLength(1);
  });

  it('Should Always Render RightPanelToggler in RightPanel', () => {
    const rightPanelWrapper = mountWithProviders(<RightPanel />);
    expect(rightPanelWrapper.find(RightPanelToggler)).toHaveLength(1);
  });

  it('Should Always Render Section in RightPanel', () => {
    const rightPanelWrapper = mountWithProviders(<RightPanel />);
    expect(rightPanelWrapper.find(Section)).toHaveLength(1);
  });

  it('Should Always Render Tabs in RightPanel', () => {
    const rightPanelWrapper = mountWithProviders(<RightPanel />);
    expect(rightPanelWrapper.find(Tabs)).toHaveLength(1);
  });

  it('Should Always Render Settings in RightPanel', () => {
    const rightPanelWrapper = mountWithProviders(<RightPanel />);
    expect(rightPanelWrapper.find(Settings)).toHaveLength(1);
  });

  it('Section contains Tabs & Settings', () => {
    const rightPanelWrapper = mountWithProviders(<RightPanel />);
    expect(rightPanelWrapper.find(Tabs).parent().is(Section)).toEqual(true);
    expect(rightPanelWrapper.find(Settings).parent().is(Section)).toEqual(true);
  });

  it('Should Not Pass isIdle Class to Panel If `isRightPanelOpen` is `true`', () => {
    const builderWrapper = mountWithProviders(<RightPanel />, { builderProps: { isRightPanelOpen: true } });
    expect(builderWrapper.find(Panel).props().additionalClassName).not.toMatch('isIdle');
  });

  it('Should Pass isIdle Class to Panel If `isRightPanelOpen` is `false`', () => {
    const builderWrapper = mountWithProviders(<RightPanel />);
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('isIdle');
  });

  it('Should Not Pass otherOpened Class to Panel If `isSlidesPanelOpen` is `false`', () => {
    const builderWrapper = mountWithProviders(<RightPanel />);
    expect(builderWrapper.find(Panel).props().additionalClassName).not.toMatch('otherOpened');
  });

  it('Should Pass otherOpened Class to Panel If `isSlidesPanelOpen` is `true`', () => {
    const builderWrapper = mountWithProviders(<RightPanel />, { builderProps: { isSlidesPanelOpen: true } });
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('otherOpened');
  });

  it('Should Render `RightPanelToggler` with `paneClose` class name If `isRightPanelOpen` is `true`', () => {
    const builderWrapper = mountWithProviders(<RightPanel />, { builderProps: { isRightPanelOpen: true } });
    expect(builderWrapper.find('.paneClose')).toHaveLength(1);
  });

  it('Should Not Render `RightPanelToggler` If `isSlidesPanelOpen` is `true`', () => {
    const builderWrapper = mountWithProviders(<RightPanel />, { builderProps: { isSlidesPanelOpen: true } });
    expect(builderWrapper.find(Panel).props().additionalClassName).toMatch('isIdle');
    expect(builderWrapper.find(RightPanelToggler)).toHaveLength(0);
  });
});
