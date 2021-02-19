import React from 'react';
import DndWrapper from '../../../../components/Builder/DndWrapper';
import { selectors } from '../../../../__test_helpers__/constants';
import Element from '../../../../components/Builder/Element';

import { acceptedItems } from '../../../../../stories/config';

describe('Element ', () => {
  it('Should Call onItemAdd Once Click an Element', () => {
    const eventMock = jest.fn();

    const props = {
      ...Element.defaultProps,
      acceptedItems: acceptedItems,
      itemType: 'text',
      onItemAdd: eventMock,
    };

    const elementWrapper = mount(
      <DndWrapper>
        <Element {...props} />
      </DndWrapper>,
    );

    const toolItem = elementWrapper.find(selectors.toolItem);
    toolItem.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it('Should Show Passing `title` Prop Value', () => {
    const title = 'Title';
    const elementWrapper = mount(
      <DndWrapper>
        <Element title={title} />
      </DndWrapper>,
    );
    expect(elementWrapper.find(selectors.toolItemName).text()).toEqual(title);
  });
});
