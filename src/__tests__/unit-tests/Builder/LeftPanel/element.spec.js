import React from 'react';
import DndWrapper from '../../../../components/Builder/DndWrapper';
import { selectors } from '../../../../__test_helpers__/constants';
import Element from '../../../../components/Builder/Element';

import { acceptedItems } from '../../../../../stories/config';
import { mountWithProviders } from '../../../../__test_helpers__/utils';

describe('Element ', () => {
  it('Should Call onItemAdd Once Click an Element', () => {
    const eventMock = jest.fn();
    const elementWrapper = mountWithProviders(
      <DndWrapper>
        <Element itemType="text" />
      </DndWrapper>,
    { propProps: { acceptedItems: acceptedItems, onItemAdd: eventMock } });

    const toolItem = elementWrapper.find(selectors.toolItem);
    toolItem.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it('Should Show Passing `title` Prop Value', () => {
    const title = 'Title';
    const elementWrapper = mountWithProviders(
      <DndWrapper>
        <Element title={title} />
      </DndWrapper>
    );
    expect(elementWrapper.find(selectors.toolItemName).text()).toEqual(title);
  });
});
