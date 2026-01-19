import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import LeftPanelOpener from '../../../../components/Panels/LeftPanel/LeftPanelOpener';
import { BuilderProvider } from '../../../../contexts/BuilderContext';

describe('LeftPanelOpener', () => {
  it('Should Always Render Left Panel Open Button', () => {
    const leftPanelOpenerWrapper = mount(
      <BuilderProvider>
        <LeftPanelOpener />
      </BuilderProvider>,
    );
    const leftPanelOpenButton = leftPanelOpenerWrapper.find(selectors.paneToggler);
    expect(leftPanelOpenButton).toHaveLength(1);
  });

  it('Should Call setIsLeftPanelOpen Once Click Left Panel Opener Button', () => {
    const eventMock = jest.fn();
    const leftPanelOpenerWrapper = mount(
      <BuilderProvider setIsLeftPanelOpen={eventMock}>
        <LeftPanelOpener />
      </BuilderProvider>,
    );
    const leftPanelOpenButton = leftPanelOpenerWrapper.find(selectors.paneToggler);
    leftPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });
});
