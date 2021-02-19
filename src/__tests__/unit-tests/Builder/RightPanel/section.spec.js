import React from 'react';
import { selectors } from '../../../../__test_helpers__/constants';
import Section from '../../../../components/Builder/Section';

describe('Section Component', () => {
  it('Should Show` hasAdditional` class &Prop Value if `additionalComponent`Prop Has Value', () => {
    const additionalComponent = 'Additional Component';
    const sectionWrapper = shallow(<Section additionalComponent={additionalComponent} />);
    expect(sectionWrapper.find(selectors.hasAdditional)).toHaveLength(1);
    expect(sectionWrapper.find(selectors.toolTitle).text()).toBe(additionalComponent);
  });

  it('Should Render Icon if `icon` Prop Has Value', () => {
    const icon = 'Icon';
    const sectionWrapper = shallow(<Section icon={icon} />);
    expect(sectionWrapper.find(selectors.titleIcon)).toHaveLength(1);
  });

  it('Should Show Title Value if `title` Prop Has Value', () => {
    const title = 'Title';
    const sectionWrapper = shallow(<Section title={title} />);
    expect(sectionWrapper.find(selectors.titleName).text()).toBe(title);
  });

  it('Should Render Section Component Accordin to Default Props', () => {
    const sectionWrapper = shallow(<Section />);
    expect(sectionWrapper.find(selectors.hasAdditional)).toHaveLength(0);
    expect(sectionWrapper.find(selectors.toolTitle).text()).toBe('');
    expect(sectionWrapper.find(selectors.titleIcon)).toHaveLength(0);
    expect(sectionWrapper.find(selectors.titleName).text()).toBe('');
  });
});
