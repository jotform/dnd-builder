import React from 'react';
import Presentation from '../../../components/Presentation/Presentation';
import ReportWrapper from '../../../components/ReportWrapper';
import PresentationWrapper from '../../../components/Presentation/PresentationWrapper';
import PageNavigation from '../../../components/Presentation/PresentationBar/PageNavigation';
import Print from '../../../components/Print';

import StaticScene from '../../../components/Preview/StaticScene';
import StaticPage from '../../../components/Preview/StaticPage';
import StaticItem from '../../../components/Preview/StaticItem';
import ZoomControls from '../../../components/Builder/ZoomControls';
import ReportItemRenderer from '../../../components/Builder/ReportItemRenderer';
import ItemPositioner from '../../../components/ItemPositioner';
import examplePages from '../../../../stories/config/examplePages';
import {
  acceptedItems,
  defaultSettings,
} from '../../../../stories/config';
import { BuilderProvider } from '../../../contexts/BuilderContext';
import { PresentationProvider } from '../../../contexts/PresentationContext';
import { PropProvider } from '../../../contexts/PropContext';
import { selectors } from '../../../__test_helpers__/constants';

describe('Presentation Stories', () => {
  const props = {
    ...Presentation.defaultProps,
    acceptedItems: acceptedItems,
    pages: examplePages,
    presentationBarActions: [
      {
        key: 'print',
      },
      {
        className: 'isSuccess',
        handler: () => { console.log('Clicked console logger.'); },
        icon: 'share',
        key: 'share',
        title: 'Console Logger',
      },
      {
        key: 'present',
      },
    ],
    settings: defaultSettings,

  };

  const presentation = mount(<Presentation {...props} />);

  it('Should Render Presentation Component Tree According to Presentation Story', () => {
    const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    const pageIndicator = `${selectors.forSlide} ${selectors.controllerIndicator}`;

    expect(presentation.find(PresentationProvider)).toHaveLength(1);
    expect(presentation.find(PropProvider)).toHaveLength(1);
    expect(presentation.find(BuilderProvider)).toHaveLength(1);
    expect(presentation.find(ReportWrapper)).toHaveLength(2);
    expect(presentation.find(PresentationWrapper)).toHaveLength(1);
    expect(presentation.find(PageNavigation)).toHaveLength(1);
    expect(presentation.find(StaticScene)).toHaveLength(2);
    expect(presentation.find(ZoomControls)).toHaveLength(2);
    expect(presentation.find(StaticPage)).toHaveLength(4);
    expect(presentation.find(StaticItem)).toHaveLength(12);
    expect(presentation.find(ItemPositioner)).toHaveLength(12);
    expect(presentation.find(ReportItemRenderer)).toHaveLength(12);
    expect(presentation.find(pageIndicator)).toHaveLength(1);
    expect(presentation.find(commonButtonCx)).toHaveLength(2);
    expect(presentation.find(selectors.progressBar)).toHaveLength(0);
  });

  it('`pageCount` prop passes to PresentationProvider correctly', () => {
    const wrapper = presentation.find(PresentationProvider);
    expect(wrapper.props().pageCount).toBe(props.pages.length);
  });

  it('`acceptedItems` and `setting` props passes to PropProvider correctly', () => {
    const wrapper = presentation.find(PropProvider);
    expect(wrapper.props().acceptedItems).toBe(props.acceptedItems);
    expect(wrapper.props().settings).toBe(props.settings);
  });

  it('`presentationBarActions` prop passes to PresentationWrapper correctly', () => {
    const wrapper = presentation.find(PresentationWrapper);
    expect(wrapper.props().presentationBarActions).toBe(props.presentationBarActions);
  });

  it('`pages` prop passes to StaticScene correctly', () => {
    const wrapper = presentation.find(StaticScene).first();
    expect(wrapper.props().pages).toBe(props.pages);
  });

  it('`pages` prop passes to Print correctly', () => {
    const wrapper = presentation.find(Print);
    expect(wrapper.props().pages).toBe(props.pages);
  });

  it('`pages` prop passes to ZoomControls', () => {
    const wrapperZoomControls = presentation.find(ZoomControls);
    expect(wrapperZoomControls.first().props().pages).toBe(props.pages);
  });

  it('`items` prop passes to StaticPage', () => {
    const wrapperStaticPage = presentation.find(StaticPage);
    expect(wrapperStaticPage.first().props().items).toBe(props.pages[0].items);
  });

  it('`item` prop passes to StaticItem and ReportItemRenderer', () => {
    const wrapperStaticItem = presentation.find(StaticItem);
    const wrapperReportItemRenderer = presentation.find(ReportItemRenderer);
    expect(wrapperStaticItem.first().props().item).toBe(props.pages[0].items[0]);
    expect(wrapperReportItemRenderer.first().props().item).toBe(props.pages[0].items[0]);
  });

  it('Should navigate between pages', () => {
    const commonButtonCx = `${selectors.forSlide} ${selectors.controllerItem}${selectors.isGray}`;
    const pageIndicator = `${selectors.forSlide} ${selectors.controllerIndicator}`;
    const decreaseButton = presentation.find(commonButtonCx).first();

    const increaseButton = presentation.find(commonButtonCx).last();
    increaseButton.simulate('click');
    expect(presentation.find(pageIndicator).text()).toBe('2/2');

    decreaseButton.simulate('click');
    expect(presentation.find(pageIndicator).text()).toBe('1/2');
  });
});
