import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import LeftPanelCloser from '../../../../components/Panels/LeftPanel/LeftPanelCloser';
import { BuilderProvider } from '../../../../contexts/BuilderContext';

describe('LeftPanelCloser', () => {
  it('Should Always Render Left Panel Close Button', () => {
    const leftPanelOpenerWrapper = mount(
      <BuilderProvider>
        <LeftPanelCloser />
      </BuilderProvider>,
    );
    const leftPanelOpenButton = leftPanelOpenerWrapper.find(selectors.paneClose);
    expect(leftPanelOpenButton).toHaveLength(1);
  });

  it('Should Call setIsLeftPanelOpen Once Click Left Panel Close Button', () => {
    const eventMock = jest.fn();
    const leftPanelOpenerWrapper = mount(
      <BuilderProvider setIsLeftPanelOpen={eventMock}>
        <LeftPanelCloser />
      </BuilderProvider>,
    );
    const leftPanelOpenButton = leftPanelOpenerWrapper.find(selectors.paneClose);
    leftPanelOpenButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });
});
