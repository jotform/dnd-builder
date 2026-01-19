import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import RightPanelToggler from '../../../../components/Panels/RightPanel/RightPanelToggler';
import { BuilderProvider } from '../../../../contexts/BuilderContext';

describe('RightPanelToggler', () => {
  it('Should Always Render Right Panel Close and Open Buttons', () => {
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider>
        <RightPanelToggler />
      </BuilderProvider>,
    );

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    expect(rightPanelOpenButton).toHaveLength(1);

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    expect(rightPanelCloseButton).toHaveLength(1);
  });

  it('Should Call setIsRightPanelOpen Once Click Right Panel Open & Close Buttons', () => {
    const eventMock = jest.fn();
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider setIsRightPanelOpen={eventMock}>
        <RightPanelToggler />
      </BuilderProvider>,
    );

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalledTimes(1);

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    expect(eventMock).toHaveBeenCalledTimes(2);
  });

  it('Should Call setActiveElement Once Click Right Panel Open Button', () => {
    const eventMock = jest.fn();
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider setActiveElement={eventMock}>
        <RightPanelToggler />
      </BuilderProvider>,
    );

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it.skip('It Should Open Right Panel Once Click Open Button', () => {
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider>
        <RightPanelToggler />
      </BuilderProvider>,
    );

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    // expect(rightPanelTogglerWrapper.state().isRightPanelOpen).toBe(true);
  });

  it.skip('It Should Close Right Panel Once Click Close Button', () => {
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider isRightPanelOpen={true}>
        <RightPanelToggler />
      </BuilderProvider>,
    );

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    // expect(rightPanelTogglerWrapper.state().isRightPanelOpen).toBe(false);
  });

  it('It Should Call `onRightPanelsToggled` Callback With `false` Once click Close Button', () => {
    const onRightPanelsToggled = jest.fn();
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider
        onRightPanelsToggled={onRightPanelsToggled}
        isRightPanelOpen={true}
      >
        <RightPanelToggler />
      </BuilderProvider>,
    );
    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    expect(onRightPanelsToggled).toHaveBeenCalledWith(false);
  });

  it('It Should Call `onRightPanelsToggled` Callback With `true` Once click Open Button', () => {
    const onRightPanelsToggled = jest.fn();
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider
        onRightPanelsToggled={onRightPanelsToggled}
        isRightPanelOpen={true}
      >
        <RightPanelToggler />
      </BuilderProvider>,
    );
    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(onRightPanelsToggled).toHaveBeenCalledWith(true);
  });
});
