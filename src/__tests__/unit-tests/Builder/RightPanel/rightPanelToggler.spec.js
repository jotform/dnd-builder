import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import RightPanelToggler from '../../../../components/Panels/RightPanel/RightPanelToggler';
import { BuilderProvider } from '../../../../utils/builderContext';

describe('RightPanelToggler', () => {
  it('Should Always Render Right Panel Close and Open Buttons', () => {
    const rightPanelTogglerWrapper = shallow(<RightPanelToggler />);

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    expect(rightPanelOpenButton).toHaveLength(1);

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    expect(rightPanelCloseButton).toHaveLength(1);
  });

  it('Should Call setIsRightPanelOpen Once Click Right Panel Open & Close Buttons', () => {
    const eventMock = jest.fn();
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider>
        <RightPanelToggler />
      </BuilderProvider>,
    );
    rightPanelTogglerWrapper.setState({ setIsRightPanelOpen: eventMock });

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
      <BuilderProvider>
        <RightPanelToggler />
      </BuilderProvider>,
    );
    rightPanelTogglerWrapper.setState({ setActiveElement: eventMock });

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it('It Should Open Right Panel Once Click Open Button', () => {
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider>
        <RightPanelToggler />
      </BuilderProvider>,
    );

    const rightPanelOpenButton = rightPanelTogglerWrapper.find(selectors.rightPanelOpen);
    rightPanelOpenButton.simulate('click');
    expect(rightPanelTogglerWrapper.state().isRightPanelOpen).toBe(true);
  });

  it('It Should Close Right Panel Once Click Close Button', () => {
    const rightPanelTogglerWrapper = mount(
      <BuilderProvider>
        <RightPanelToggler />
      </BuilderProvider>,
    );
    rightPanelTogglerWrapper.setState({ isRightPanelOpen: true });

    const rightPanelCloseButton = rightPanelTogglerWrapper.find(selectors.rightPanelClose);
    rightPanelCloseButton.simulate('click');
    expect(rightPanelTogglerWrapper.state().isRightPanelOpen).toBe(false);
  });
});
