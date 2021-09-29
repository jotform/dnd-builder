import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import SearchInput from '../../../../components/Builder/SearchInput';
import SearchIcon from '../../../../assets/search.svg';
import CrossIcon from '../../../../assets/svg/close.svg';

describe('SearchInput', () => {
  it('Should Call setElements Once Search a Value', () => {
    const mockEvent = jest.fn();

    const searchInputWrapper = shallow(<SearchInput setElements={mockEvent} />);

    searchInputWrapper.find('input').simulate('change', { target: { value: 'value' } });
    expect(mockEvent).toHaveBeenCalledTimes(1);
  });

  it('Should Call setElements & Remove Search Value Once Press Escape Key', () => {
    const mockEvent = jest.fn();

    const searchInputWrapper = mount(<SearchInput setElements={mockEvent} />);
    searchInputWrapper.find('input').simulate('change', { target: { value: 'Value' } });
    searchInputWrapper.find('input').simulate('keyDown', { key: 'Escape', stopPropagation() {} });

    expect(mockEvent).toHaveBeenCalled();
    expect(searchInputWrapper.find('input').props().value).toBe('');
  });

  it('Should Call setElements & Remove Search Value Once Click Remove Search Button', () => {
    const mockEvent = jest.fn();

    const searchInputWrapper = shallow(<SearchInput setElements={mockEvent} />);
    searchInputWrapper.find('input').simulate('change', { target: { value: 'Value' } });
    searchInputWrapper.find(selectors.showDelete).simulate('click');

    expect(mockEvent).toHaveBeenCalled();
    expect(searchInputWrapper.find('input').props().value).toBe('');
  });

  it('Should Render CrossIcon Only and `showDelete` class if There is a Search Value', () => {
    const mockEvent = jest.fn();

    const searchInputWrapper = shallow(<SearchInput setElements={mockEvent} />);

    searchInputWrapper.find('input').simulate('change', { target: { value: 'value' } });
    expect(searchInputWrapper.find(selectors.showDelete)).toHaveLength(1);
    expect(searchInputWrapper.find(CrossIcon)).toHaveLength(1);
    expect(searchInputWrapper.find(SearchIcon)).toHaveLength(1);
  });

  it('Should Render SearchIcon Only if There is a Search Value', () => {
    const mockEvent = jest.fn();

    const component = shallow(<SearchInput setElements={mockEvent} />);

    expect(component.find(SearchIcon)).toHaveLength(1);
    expect(component.find(CrossIcon)).toHaveLength(0);
    expect(component.find(selectors.showDelete)).toHaveLength(0);
  });
});
