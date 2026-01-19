import React from 'react';
import Modal from 'react-modal';
import { selectors } from '../../../__test_helpers__/constants';
import { PresentationProvider } from '../../../contexts/PresentationContext';
import PresentationWrapper from '../../../components/Presentation/PresentationWrapper';

describe('PresentationWrapper', () => {
  it('Should Always Render Modal in PresentationWrapper', () => {
    const presentationWrapper = shallow(
      <PresentationProvider>
        <PresentationWrapper />
      </PresentationProvider>,
    );
    expect(presentationWrapper.find(Modal)).toHaveLength(1);
  });

  // TODO :: we now have PresentationBar component. We should update stories accordingly
  // it('Should Render PageNavigation & PresentationHeader When isFullScreen is false', () => {
  //   const presentationWrapper = shallow(
  //     <PresentationWrapper />,
  //   );
  // });

  it('Should Render Progress Bar if there is more than 2 pages', () => {
    const presentationWrapper = mount(
      <PresentationProvider pageCount={4}>
        <PresentationWrapper />
      </PresentationProvider>,
    );
    expect(presentationWrapper.find(selectors.progressBar)).toHaveLength(1);
  });

  it('Should Change ProgressBar Width Property Based on currentPage and pageCount Props', () => {
    const props = {
      currentPage: 3,
      pageCount: 5,
    };
    const presentationWrapper = mount(
      <PresentationProvider {...props}>
        <PresentationWrapper />
      </PresentationProvider>,
    );

    const progressBarStyle = presentationWrapper.find(selectors.progressBar).props().style.width;
    expect(progressBarStyle).toEqual(`${(100 / (props.pageCount - 1)) * (props.currentPage - 1)}%`);
  });

  it('Should Not Render Progress Bar if there is less than 3 pages', () => {
    const presentationWrapper = mount(
      <PresentationProvider pageCount={2}>
        <PresentationWrapper />
      </PresentationProvider>,
    );
    expect(presentationWrapper.find(selectors.progressBar)).toHaveLength(0);
  });

  it.only('Should Not Render PresentationHeader, Progress Bar if isFullScreen true', () => {
    const presentationWrapper = mount(
      <PresentationProvider isFullscreen={true}>
        <PresentationWrapper />
      </PresentationProvider>,
    );
    expect(presentationWrapper.find(selectors.progressBar)).toHaveLength(0);
  });
});
