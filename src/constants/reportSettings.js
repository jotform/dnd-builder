import { divider } from '../utils/staticSettings';
import { REPORT_SETTINGS_ITEM_TYPE } from './itemTypes';
import reportLayoutSettings from './reportLayoutSettings';

export const reportSettings = {
  settings: [
    ...reportLayoutSettings,
    {
      experimental: true,
      key: 'reportPageTransition',
      label: 'Page Transitions',
      options: [
        {
          label: 'No Animation',
          value: 'noAnimation',
        },
        {
          label: 'Slide',
          value: 'horizontalSlide',
        },
        {
          label: 'Vertical Slide',
          value: 'verticalSlide',
        },
        {
          label: 'Scale and Slide',
          value: 'scaleAndSlide',
        },
        {
          label: 'Scale and Fade',
          value: 'scaleAndFade',
        },
      ],
      section: 'GENERAL',
      type: 'dropdown',
    },
    {
      ...divider('GENERAL'),
      experimental: true,
    },
    {
      key: 'reportBackgroundColor',
      label: 'Background Color',
      section: 'STYLE',
      type: 'colorPicker',
    },
    {
      key: 'reportBackgroundGradientEnabled',
      label: 'Enable Gradient Background',
      section: 'STYLE',
      type: 'toggle',
    },
    {
      dependencies: 'reportBackgroundGradientEnabled',
      key: 'reportBackgroundGradientStartColor',
      label: 'Gradient Start Color',
      section: 'STYLE',
      type: 'colorPicker',
    },
    {
      dependencies: 'reportBackgroundGradientEnabled',
      key: 'reportBackgroundGradientEndColor',
      label: 'Gradient End Color',
      section: 'STYLE',
      type: 'colorPicker',
    },
    {
      dependencies: 'reportBackgroundGradientEnabled',
      key: 'reportBackgroundGradientDirection',
      label: 'Gradient Direction',
      options: [
        {
          label: 'Left to Right',
          value: 'to right',
        },
        {
          label: 'Top to Bottom',
          value: 'to bottom',
        },
        {
          label: 'Bottom to Top',
          value: 'to top',
        },
        {
          label: 'Top Left to Bottom Right',
          value: 'to bottom right',
        },
        {
          label: 'Top Right to Bottom Left',
          value: 'to bottom left',
        },
        {
          label: 'Radial (Center)',
          value: 'radial',
        },
      ],
      section: 'STYLE',
      type: 'dropdown',
    },
    {
      ...divider('STYLE'),
    },
  ],
};

export default {
  itemType: REPORT_SETTINGS_ITEM_TYPE,
  settings: reportSettings.settings,
};
