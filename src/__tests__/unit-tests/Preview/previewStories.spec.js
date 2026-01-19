import React from 'react';
import Preview from '../../../components/Preview';
import { BuilderProvider } from '../../../contexts/BuilderContext';
import { PropProvider } from '../../../contexts/PropContext';
import ReportWrapper from '../../../components/ReportWrapper';
import StaticScene from '../../../components/Preview/StaticScene';
import StaticPage from '../../../components/Preview/StaticPage';
import StaticItem from '../../../components/Preview/StaticItem';
import ZoomControls from '../../../components/Builder/ZoomControls';
import ReportItemRenderer from '../../../components/Builder/ReportItemRenderer';
import ItemPositioner from '../../../components/ItemPositioner';

import {
  acceptedItems,
  defaultSettings,
} from '../../../../stories/config';

import examplePages from '../../../../stories/config/examplePages';
import { PresentationProvider } from '../../../contexts/PresentationContext';

describe('Preview Stories', () => {
  const props = {
    acceptedItems: acceptedItems,
    pages: examplePages,
    settings: defaultSettings,
  };

  const preview = mount(
      <PresentationProvider>
        <Preview {...props} />
      </PresentationProvider>,
    );
  it('Should Render Preview Component Tree According to Preview Story', () => {
    expect(preview.find(BuilderProvider)).toHaveLength(1);
    expect(preview.find(PropProvider)).toHaveLength(1);
    expect(preview.find(ReportWrapper)).toHaveLength(1);
    expect(preview.find(StaticScene)).toHaveLength(1);
    expect(preview.find(ZoomControls)).toHaveLength(1);
    expect(preview.find(StaticPage)).toHaveLength(2);
    expect(preview.find(StaticItem)).toHaveLength(6);
    expect(preview.find(ItemPositioner)).toHaveLength(6);
    expect(preview.find(ReportItemRenderer)).toHaveLength(6);
  });

  it('`acceptedItems` and `setting` props passes to PropProvider correctly', () => {
    const wrapper = preview.find(PropProvider);
    expect(wrapper.props().acceptedItems).toBe(props.acceptedItems);
    expect(wrapper.props().settings).toBe(props.settings);
  });

  it('`pages` prop passes to StaticScene correctly', () => {
    const wrapper = preview.find(StaticScene);
    expect(wrapper.props().pages).toBe(props.pages);
  });

  it('`pages` prop passes to ZoomControls', () => {
    const wrapperZoomControls = preview.find(ZoomControls);
    expect(wrapperZoomControls.first().props().pages).toBe(props.pages);
  });

  it('`items` prop passes to StaticPage', () => {
    const wrapperStaticPage = preview.find(StaticPage);
    expect(wrapperStaticPage.first().props().items).toBe(props.pages[0].items);
  });

  it('`item` prop passes to StaticItem and ReportItemRenderer', () => {
    const wrapperStaticItem = preview.find(StaticItem);
    const wrapperReportItemRenderer = preview.find(ReportItemRenderer);
    expect(wrapperStaticItem.first().props().item).toBe(props.pages[0].items[0]);
    expect(wrapperReportItemRenderer.first().props().item).toBe(props.pages[0].items[0]);
  });
});
