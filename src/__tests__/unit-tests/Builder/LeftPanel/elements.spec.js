import React from 'react';
import DndWrapper from '../../../../components/Builder/DndWrapper';
import Elements from '../../../../components/Panels/LeftPanel/Elements';
import LeftPanelCloser from '../../../../components/Panels/LeftPanel/LeftPanelCloser';
import {
  RichText, Image, Chart,
} from '../../../../index';
import Section from '../../../../components/Builder/Section';
import Element from '../../../../components/Builder/Element';
import Tabs from '../../../../components/Builder/Tabs';
import { mountWithProviders } from '../../../../__test_helpers__/utils';

describe('Elements', () => {
  it('Should Always Render LeftPanelCloser', () => {
    const elementsWrapper = mountWithProviders(<Elements />);

    expect(elementsWrapper.find(LeftPanelCloser)).toHaveLength(1);
  });

  it('Should Not Render SectionWithSearch & Elements If LeftPanelConfig is Empty', () => {
    const elementsWrapper = mountWithProviders(<Elements />);
    expect(elementsWrapper.find(Section)).toHaveLength(1);
    expect(elementsWrapper.find(Element)).toHaveLength(0);
  });

  it('Should Render SectionWithSearch & Elements Based on‘leftPanelConfig‘', () => {
    const props = {
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
        title: 'REPORT ELEMENTS',
        section: 'REPORT ELEMENTS',
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
        title: 'FORM FIELDS',
        section: 'FORM FIELDS',
      },
      ],
    };

    const elementsWrapper = mountWithProviders(
        <DndWrapper>
          <Elements />
        </DndWrapper>,
        { propProps: { leftPanelConfig: props.leftPanelConfig } }
    );
    expect(elementsWrapper.find(Section)).toHaveLength(1);
    expect(elementsWrapper.find(Tabs)).toHaveLength(1);
    expect(elementsWrapper.find(Element)).toHaveLength(2); // tabbed structure
  });
});
