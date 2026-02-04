import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import RightPanelToggler from '../../../../components/Panels/RightPanel/RightPanelToggler';
import { mountWithProviders } from '../../../../__test_helpers__/utils';

describe('RightPanelToggler', () => {
  it('Should Always Render Right Panel Close and Open Buttons', () => {
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />);
    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    expect(rightPanelOpenButton).toHaveLength(1);

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    expect(rightPanelCloseButton).toHaveLength(1);
  });

  it('Should Call setIsRightPanelOpen Once Click Right Panel Open & Close Buttons', () => {
    const eventMock = jest.fn();
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />, { builderProps: { setIsRightPanelOpen: eventMock } });
    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalledTimes(1);

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    expect(eventMock).toHaveBeenCalledTimes(2);
  });

  it('Should Call setActiveElements Once Click Right Panel Open Button', () => {
    const eventMock = jest.fn();
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />, { builderProps: { setActiveElements: eventMock } });
    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it.skip('It Should Open Right Panel Once Click Open Button', () => {
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />);
    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    // expect(rightPanelTogglerWrapper.state().isRightPanelOpen).toBe(true);
  });

  it.skip('It Should Close Right Panel Once Click Close Button', () => {
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />, { builderProps: { isRightPanelOpen: true } });
    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    // expect(rightPanelTogglerWrapper.state().isRightPanelOpen).toBe(false);
  });

  it('It Should Call `onRightPanelsToggled` Callback With `false` Once click Close Button', () => {
    const onRightPanelsToggled = jest.fn();
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />, { builderProps: { onRightPanelsToggled, isRightPanelOpen: true } });
    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    expect(onRightPanelsToggled).toHaveBeenCalledWith(false);
  });

  it('It Should Call `onRightPanelsToggled` Callback With `true` Once click Open Button', () => {
    const onRightPanelsToggled = jest.fn();
    const rightPanelTogglerWrapper = mountWithProviders(<RightPanelToggler />, { builderProps: { onRightPanelsToggled, isRightPanelOpen: true } });
    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(onRightPanelsToggled).toHaveBeenCalledWith(true);
  });
});
