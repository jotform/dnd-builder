import React from 'react';
import DndWrapper from '../../../../components/Builder/DndWrapper';
import { selectors } from '../../../../__test_helpers__/constants';
import Element from '../../../../components/Builder/Element';

import { acceptedItems } from '../../../../../stories/config';
import { BuilderProvider } from '../../../../contexts/BuilderContext';

describe('Element ', () => {
  it('Should Call onItemAdd Once Click an Element', () => {
    const eventMock = jest.fn();

    const props = {
      acceptedItems: acceptedItems,
      itemType: 'text',
      onItemAdd: eventMock,
    };

    const elementWrapper = mount(
      <BuilderProvider>
        <DndWrapper>
          <Element {...props} />
        </DndWrapper>
      </BuilderProvider>,
    );

    const toolItem = elementWrapper.find(selectors.toolItem);
    toolItem.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it('Should Show Passing `title` Prop Value', () => {
    const title = 'Title';
    const elementWrapper = mount(
      <BuilderProvider>
        <DndWrapper>
          <Element title={title} />
        </DndWrapper>
      </BuilderProvider>,
    );
    expect(elementWrapper.find(selectors.toolItemName).text()).toEqual(title);
  });
});
