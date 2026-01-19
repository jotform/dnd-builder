import React from 'react';
import StaticItem from '../../../components/Preview/StaticItem';
import ItemPositioner from '../../../components/ItemPositioner';

describe('StaticItem Component Tree', () => {
  it('Should Render ItemPositioner', () => {
    const staticItemShallow = shallow(<StaticItem />);
    expect(staticItemShallow.find(ItemPositioner)).toHaveLength(1);
  });
});
