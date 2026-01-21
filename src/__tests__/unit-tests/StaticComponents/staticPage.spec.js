import React from 'react';
import { selectors } from '../../../__test_helpers__/constants';
import StaticItem from '../../../components/Preview/StaticItem';
import StaticPage from '../../../components/Preview/StaticPage';
import ReportItemRenderer from '../../../components/Builder/ReportItemRenderer';
import { mountWithProviders } from '../../../__test_helpers__/utils';
import StaticScene from '../../../components/Preview/StaticScene';

describe('StaticPage Component Tree', () => {
  it('Should Not Render StaticItem and ReportItemRenderer If Items Prop Not Defined', () => {
    const staticPageShallow = mountWithProviders(
      <StaticPage />,
      { propProps: { pages: [{ items: [] }], additionalPageItems: undefined }
    });
    expect(staticPageShallow.find(StaticItem).exists()).toBeFalsy();
    expect(staticPageShallow.find(ReportItemRenderer).exists()).toBeFalsy();
  });

  it.skip('Should Render StaticItem and ReportItemRenderer According Items Prop', () => {
    const staticPageShallow = mountWithProviders(<StaticScene />, {
      propProps: { pages: [{id: 1, items: [{ id: 'f478ro' }, { id: 'ft063f' }, { id: 't31m8t' }] }] }
    });

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
    const staticPageShallow = mountWithProviders(<StaticPage />,
      {
        propProps: { additionalPageItems: [additionalPageItems] }
      }
    );

    const wrapper = staticPageShallow.find(selectors.jfReportHider);
    expect(wrapper.contains(additionalPageItems)).toBeTruthy();
  });
});
