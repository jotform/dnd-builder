import React from 'react';
import DndWrapper from '../../../../components/Builder/DndWrapper';
import Elements from '../../../../components/Panels/LeftPanel/Elements';
import LeftPanelCloser from '../../../../components/Panels/LeftPanel/LeftPanelCloser';
import {
  RichText, Image, Chart,
} from '../../../../index';
import SectionWithSearch from '../../../../components/Builder/SectionWithSearch';
import Element from '../../../../components/Builder/Element';

describe('Elements', () => {
  it('Should Always Render LeftPanelCloser', () => {
    const elementsWrapper = shallow(
      <Elements {...Elements.defaultProps} />,
    );

    expect(elementsWrapper.find(LeftPanelCloser)).toHaveLength(1);
  });

  it('Should Not Render SectionWithSearch & Elements If LeftPanelConfig is Empty', () => {
    const elementsWrapper = shallow(
      <Elements {...Elements.defaultProps} />,
    );
    expect(elementsWrapper.find(SectionWithSearch)).toHaveLength(0);
    expect(elementsWrapper.find(Element)).toHaveLength(0);
  });

  it('Should Render SectionWithSearch & Elements Based on‘leftPanelConfig‘', () => {
    const props = {
      ...Elements.defaultProps,
      leftPanelConfig: [{
        elements: [
          {
            iconType: 'textElement',
            itemType: RichText.itemType,
            title: 'Text',
          },
          {
            iconType: 'image',
            itemType: Image.itemType,
            title: 'Image',
          },
        ],
        title: 'Report Elements',
      }, {
        elements: [
          {
            iconType: 'email',
            itemType: Chart.itemType,
            title: 'Email',
          },
          {
            iconType: 'text',
            itemType: Chart.itemType,
            title: 'Your Name',
          },
        ],
        title: 'Form Elements',
      },
      ],
    };

    const elementsWrapper = mount(
      <DndWrapper>
        <Elements {...props} />
      </DndWrapper>,
    );
    expect(elementsWrapper.find(SectionWithSearch)).toHaveLength(2);
    expect(elementsWrapper.find(Element)).toHaveLength(4);
  });
});
