import React from 'react';
import { selectors } from '../../../__test_helpers__/constants';
import PageNavigation from '../../../components/Presentation/PresentationBar/PageNavigation';

describe('PageNavigation', () => {
  it('Should Always Render Page Indicator in PageNavigation', () => {
    const pageNavigationWrapper = shallow(
      <PageNavigation />,
    );
    const pageIndicator = `${selectors.forSlide} ${selectors.controllerIndicator}`;

    expect(pageNavigationWrapper.find(pageIndicator)).toHaveLength(1);
    expect(pageNavigationWrapper.find(pageIndicator).text()).toBe('1/1');
  });

  it('Should Render Navigation Buttons if pageCount is grater than 1', () => {
    const pageNavigationWrapper = shallow(<PageNavigation pageCount={3} />);
    const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    const pageIndicator = `${selectors.forSlide} ${selectors.controllerIndicator}`;

    expect(pageNavigationWrapper.find(commonButtonCx)).toHaveLength(2);
    expect(pageNavigationWrapper.find(pageIndicator).text()).toBe('1/3');
  });

  it('Should Disable Decrease Navigation Button if currentPage is the first page', () => {
    const pageNavigationWrapper = shallow(<PageNavigation pageCount={4} />);
    /* TODO :: page buttons now loop over to last or firt pages. We should update tests
      const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    */
    const pageIndicator = `${selectors.forSlide} ${selectors.controllerIndicator}`;


    // const increaseButton = pageNavigationWrapper.find(commonButtonCx).last();
    // const decreaseButton = pageNavigationWrapper.find(commonButtonCx).first();

    // expect(decreaseButton.hasClass('disabled')).toEqual(true);
    // expect(increaseButton.hasClass('disabled')).toEqual(false);
    expect(pageNavigationWrapper.find(pageIndicator).text()).toBe('1/4');
  });

  it('Should Disable Increase Navigation Button if currentPage is the last page', () => {
    const pageNavigationWrapper = shallow(<PageNavigation currentPage={4} pageCount={4} />);
    /* TODO :: page buttons now loop over to last or firt pages. We should update tests
      const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    */
    const pageIndicator = `${selectors.forSlide} ${selectors.controllerIndicator}`;


    // const increaseButton = pageNavigationWrapper.find(commonButtonCx).last();
    // const decreaseButton = pageNavigationWrapper.find(commonButtonCx).first();


    // expect(increaseButton.hasClass('disabled')).toEqual(true);
    // expect(decreaseButton.hasClass('disabled')).toEqual(false);

    expect(pageNavigationWrapper.find(pageIndicator).text()).toBe('4/4');
  });

  it('Should Call Increase Function Once Click Increase Navigating Button', () => {
    const eventMock = jest.fn();
    const pageNavigationWrapper = shallow(<PageNavigation currentPage={3} pageCount={4} increase={eventMock} />);
    const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    const increaseButton = pageNavigationWrapper.find(commonButtonCx).last();
    increaseButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });

  it('Should Call Decrease Function Once Click Decrease Navigating Button', () => {
    const eventMock = jest.fn();
    const pageNavigationWrapper = shallow(<PageNavigation currentPage={4} pageCount={4} decrease={eventMock} />);
    const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    const decreaseButton = pageNavigationWrapper.find(commonButtonCx).first();
    decreaseButton.simulate('click');
    expect(eventMock).toHaveBeenCalled();
  });
});
