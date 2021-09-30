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
      section: 'General',
      type: 'dropdown',
    },
    {
      key: 'reportBackgroundColor',
      label: 'Background Color',
      section: 'Style',
      type: 'colorPicker',
    },
    {
      ...divider('Style'),
    },
  ],
};

export default {
  itemType: REPORT_SETTINGS_ITEM_TYPE,
  settings: reportSettings.settings,
};
