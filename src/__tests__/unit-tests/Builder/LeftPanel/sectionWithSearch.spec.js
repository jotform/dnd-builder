import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import SectionWithSearch from '../../../../components/Builder/SectionWithSearch';
import SearchInput from '../../../../components/Builder/SearchInput';

describe('SectionWithSearch', () => {
  it('Should Not Render SearchInput & Not Contain hasSearch Class If hasSearch is false', () => {
    const sectionWithSearchWrapper = shallow(<SectionWithSearch />);
    expect(sectionWithSearchWrapper.find(SearchInput)).toHaveLength(0);
    expect(sectionWithSearchWrapper.find('.hasSearch')).toHaveLength(0);
  });

  it('Should Render SearchInput', () => { // TODO: this test needs to update
    const sectionWithSearchWrapper = shallow(<SectionWithSearch hasSearch={true} />);
    expect(sectionWithSearchWrapper.find(SearchInput)).toHaveLength(1);
  });

  it('Should Show Passing `title` Prop Value', () => {
    const title = 'Title';
    const sectionWithSearchWrapper = shallow(<SectionWithSearch title={title} />);
    expect(sectionWithSearchWrapper.find(selectors.toolItemTitle).text()).toEqual(title);
  });
});
