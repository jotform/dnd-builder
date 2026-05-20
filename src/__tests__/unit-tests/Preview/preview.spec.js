import React from 'react';
import Preview from '../../../components/Preview';
import ReportWrapper from '../../../components/ReportWrapper';
import StaticScene from '../../../components/Preview/StaticScene';
import Providers from '../../../contexts/Providers';

describe('Preview Component Tree', () => {
  const preview = shallow(<Preview />);

  it('Should Always Render Providers in Preview', () => {
    expect(preview.find(Providers)).toHaveLength(1);
  });

  it('Should Always Render ReportWrapper in Preview', () => {
    expect(preview.find(ReportWrapper)).toHaveLength(1);
  });

  it('Should Always Render StaticScene in Preview', () => {
    expect(preview.find(StaticScene)).toHaveLength(1);
  });

  it('ReportWrapper contains StaticScene ', () => {
    expect(preview.find(StaticScene).parent().is(ReportWrapper)).toEqual(true);
  });
});

describe('Preview Component Props', () => {
  const defaultProps = {
    acceptedItems: {
      text: { Component: () => <div />, itemType: 'text' },
    },
    pages: [
      {
        id: 'page-1',
        items: [{ id: 'item-1', itemType: 'text' }],
        order: 0,
      },
    ],
    settings: {
      reportBackgroundColor: '#ffffff',
      reportLayoutHeight: 794,
      reportLayoutWidth: 1123,
    },
    theme: 'lightMode',
  };

  it('should pass mode="preview" to Providers', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(Providers).prop('mode')).toBe('preview');
  });

  it('should pass mode="preview" to ReportWrapper', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(ReportWrapper).prop('mode')).toBe('preview');
  });

  it('should pass isExistsZoom to StaticScene', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(StaticScene).prop('isExistsZoom')).toBe(true);
  });

  it('should pass acceptedItems to Providers', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(Providers).prop('acceptedItems')).toEqual(defaultProps.acceptedItems);
  });

  it('should pass pages to Providers', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(Providers).prop('pages')).toEqual(defaultProps.pages);
  });

  it('should pass settings to Providers', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(Providers).prop('settings')).toEqual(defaultProps.settings);
  });

  it('should pass theme to Providers', () => {
    const wrapper = shallow(<Preview {...defaultProps} />);
    expect(wrapper.find(Providers).prop('theme')).toBe('lightMode');
  });

  it('should accept darkMode theme', () => {
    const props = { ...defaultProps, theme: 'darkMode' };
    const wrapper = shallow(<Preview {...props} />);
    expect(wrapper.find(Providers).prop('theme')).toBe('darkMode');
  });

  it('should handle additionalPageItems prop', () => {
    const additionalItems = [<div key="1">Watermark</div>];
    const props = { ...defaultProps, additionalPageItems: additionalItems };
    const wrapper = shallow(<Preview {...props} />);
    expect(wrapper.find(Providers).prop('additionalPageItems')).toEqual(additionalItems);
  });

  it('should handle itemAccessor prop', () => {
    const itemAccessor = jest.fn();
    const props = { ...defaultProps, itemAccessor };
    const wrapper = shallow(<Preview {...props} />);
    expect(wrapper.find(Providers).prop('itemAccessor')).toBe(itemAccessor);
  });

  it('should handle onAnEventTrigger prop', () => {
    const onAnEventTrigger = jest.fn();
    const props = { ...defaultProps, onAnEventTrigger };
    const wrapper = shallow(<Preview {...props} />);
    expect(wrapper.find(Providers).prop('onAnEventTrigger')).toBe(onAnEventTrigger);
  });
});
