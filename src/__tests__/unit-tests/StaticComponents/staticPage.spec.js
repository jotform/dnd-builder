import React from 'react';
import { selectors } from '../../../__test_helpers__/constants';
import StaticItem from '../../../components/Preview/StaticItem';
import StaticPage from '../../../components/Preview/StaticPage';
import ReportItemRenderer from '../../../components/Builder/ReportItemRenderer';

describe('StaticPage Component Tree', () => {
  let staticPageShallow;
  let props;

  beforeEach(() => {
    props = {
      additionalPageItems: undefined,
      items: [],
    };
    staticPageShallow = shallow(<StaticPage {...props} />);
  });

  it('Should Not Render StaticItem and ReportItemRenderer If Items Prop Not Defined', () => {
    expect(staticPageShallow.find(StaticItem).exists()).toBeFalsy();
    expect(staticPageShallow.find(ReportItemRenderer).exists()).toBeFalsy();
  });

  it('Should Render StaticItem and ReportItemRenderer According Items Prop', () => {
    staticPageShallow.setProps({ items: [{ id: 'f478ro' }, { id: 'ft063f' }, { id: 't31m8t' }] });
    expect(staticPageShallow.find(StaticItem)).toHaveLength(3);
    expect(staticPageShallow.find(ReportItemRenderer)).toHaveLength(3);
  });

  it('Should Passes `addtionalpageItems` as `children`', () => {
    const additionalPageItems = (
      <div
        key='pItems'
        className='test-pItems'
      >
        Additional Page Items
      </div>
    );

    staticPageShallow.setProps({ additionalPageItems: [additionalPageItems] });
    const wrapper = staticPageShallow.find(selectors.jfReportHider);
    expect(wrapper.contains(additionalPageItems)).toBeTruthy();
  });
});
