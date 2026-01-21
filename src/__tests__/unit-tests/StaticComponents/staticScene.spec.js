import React from 'react';
import { selectors } from '../../../__test_helpers__/constants';
import {StaticPageWithZoomPanPinch} from '../../../components/Preview/StaticPage';
import StaticScene from '../../../components/Preview/StaticScene';
import ZoomControls from '../../../components/Builder/ZoomControls';
import { mountWithProviders } from '../../../__test_helpers__/utils';

describe('StaticScene Component Tree', () => {
  it('Should Always Render Wrapper Div', () => {
    const staticSceneShallow = mountWithProviders(<StaticScene />);
    expect(staticSceneShallow.find(selectors.reportCanvas)).toHaveLength(1);
  });

  it('Should Change Wrapper Transform Style Property Based on presentationPage prop', () => {
    const props = {
      presentationPage: 3,
    };
    const staticSceneShallow = mountWithProviders(<StaticScene {...props} />);
    const wrapperDiv = staticSceneShallow.find(selectors.reportCanvas).props().style.transform;
    expect(wrapperDiv).toEqual(`translateX(-${(props.presentationPage * 100)}%)`);
  });

  it('Should Not Render StaticPage If Pages Prop Not Defined', () => {
    const staticSceneShallow = mountWithProviders(<StaticScene />);
    expect(staticSceneShallow.find(StaticPageWithZoomPanPinch).exists()).toBeFalsy();
  });

  it('Should Render StaticPage According Pages Prop', () => {
    const props = {
      pages: [
        {
          id: 'f270j8',
          items: [{ id: '692of3' }, { id: '386m6o' }],
          order: 1,
        },
        {
          id: 'rt18tf',
          items: [{ id: 'f478ro' }, { id: 'ft063f' }, { id: 't31m8t' }, { id: '8m4m76' }],
          order: 2,
        },
      ],
    };
    const staticSceneShallow = mountWithProviders(<StaticScene {...props} />, {
      presentationProps: { pageCount: props.pages.length },
      propProps: { pages: props.pages }
    });
    expect(staticSceneShallow.find(StaticPageWithZoomPanPinch)).toHaveLength(2);
  });

  it('Should Render ZoomControl If isFullscreen Prop Value is False', () => {
    const presentationWrapper = mountWithProviders(<StaticScene />, { presentationProps: { isFullscreen: false } });
    expect(presentationWrapper.find(ZoomControls)).toHaveLength(1);
  });

  /* TODO :: update tests
  /* We will show zoom in fullscreen if the mouse position
  /* is near 250px of the bottom of the window innerWidth
  */

  // it('Should Not Render ZoomControl If isFullscreen Prop Value is True', () => {
  //   const props = {
  //     isFullscreen: true,
  //   };
  //   const presentationWrapper = mount(
  //     <PresentationProvider {...props}>
  //       <StaticScene />
  //     </PresentationProvider>,
  //   );
  //   expect(presentationWrapper.find(ZoomControls)).toHaveLength(0);
  // });
});
