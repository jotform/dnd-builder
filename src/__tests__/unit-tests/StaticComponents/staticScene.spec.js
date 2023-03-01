import React from 'react';
import { PresentationProvider } from '../../../utils/presentationContext';
import { selectors } from '../../../__test_helpers__/constants';
import {StaticPageWithZoomPanPinch} from '../../../components/Preview/StaticPage';
import StaticScene from '../../../components/Preview/StaticScene';
import ZoomControls from '../../../components/Builder/ZoomControls';

describe('StaticScene Component Tree', () => {
  it('Should Always Render Wrapper Div', () => {
    const staticSceneShallow = shallow(<StaticScene {...StaticScene.defaultProps} />);
    expect(staticSceneShallow.find(selectors.reportCanvas)).toHaveLength(1);
  });

  it('Should Change Wrapper Transform Style Property Based on presentationPage prop', () => {
    const props = {
      ...StaticScene.defaultProps,
      presentationPage: 3,
    };
    const staticSceneShallow = shallow(<StaticScene {...props} />);
    const wrapperDiv = staticSceneShallow.find(selectors.reportCanvas).props().style.transform;
    expect(wrapperDiv).toEqual(`translateX(-${(props.presentationPage * 100)}%)`);
  });

  it('Should Not Render StaticPage If Pages Prop Not Defined', () => {
    const staticSceneShallow = shallow(<StaticScene {...StaticScene.defaultProps} />);
    expect(staticSceneShallow.find(StaticPageWithZoomPanPinch).exists()).toBeFalsy();
  });

  it('Should Render StaticPage According Pages Prop', () => {
    const props = {
      ...StaticScene.defaultProps,
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
    const staticSceneShallow = shallow(<StaticScene {...props} />);
    expect(staticSceneShallow.find(StaticPageWithZoomPanPinch)).toHaveLength(2);
  });

  it('Should Render ZoomControl If isFullscreen Prop Value is False', () => {
    const props = {
      ...PresentationProvider.defaultProps,
      isFullscreen: false,
    };
    const presentationWrapper = mount(
      <PresentationProvider {...props}>
        <StaticScene />
      </PresentationProvider>,
    );
    expect(presentationWrapper.find(ZoomControls)).toHaveLength(1);
  });

  /* TODO :: update tests
  /* We will show zoom in fullscreen if the mouse position
  /* is near 250px of the bottom of the window innerWidth
  */

  // it('Should Not Render ZoomControl If isFullscreen Prop Value is True', () => {
  //   const props = {
  //     ...PresentationProvider.defaultProps,
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
