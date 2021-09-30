import { divider } from '../utils/staticSettings';

const onChange = (id, { reportCustomLayout }, updater) => {
  const [reportLayoutWidth, reportLayoutHeight] = reportCustomLayout.split('x');
  updater(id, {
    reportLayoutHeight,
    reportLayoutWidth,
  });
};

const value = (val, item) => {
  return `${item.reportLayoutWidth}x${item.reportLayoutHeight}`;
};

export default [
  {
    ifValueEquals: {
      'A4 Landscape': {
        reportLayoutHeight: {
          cast: 'string',
          value: '794',
        },
        reportLayoutWidth: {
          cast: 'string',
          value: '1123',
        },
      },
      'A4 Portrait': {
        reportLayoutHeight: {
          cast: 'string',
          value: '1123',
        },
        reportLayoutWidth: {
          cast: 'string',
          value: '794',
        },
      },
      'A5 Landscape': {
        reportLayoutHeight: {
          cast: 'string',
          value: '559',
        },
        reportLayoutWidth: {
          cast: 'string',
          value: '794',
        },
      },
      'A5 Portrait': {
        reportLayoutHeight: {
          cast: 'string',
          value: '794',
        },
        reportLayoutWidth: {
          cast: 'string',
          value: '559',
        },
      },
      Web: {
        reportLayoutHeight: {
          cast: 'string',
          value: '768',
        },
        reportLayoutWidth: {
          cast: 'string',
          value: '1366',
        },
      },
    },
    key: 'reportLayout',
    label: 'Dimensions',
    options: [
      {
        label: 'A4 Landscape',
        value: 'A4 Landscape',
      },
      {
        label: 'A4 Portrait',
        value: 'A4 Portrait',
      },
      {
        label: 'A5 Landscape',
        value: 'A5 Landscape',
      },
      {
        label: 'A5 Portrait',
        value: 'A5 Portrait',
      },
      {
        label: 'Web',
        value: 'Web',
      },
      {
        label: 'Custom',
        value: 'Custom',
      },
    ],
    section: 'General',
    type: 'dropdown',
    value: val => {
      if (val === 'custom') {
        return 'Custom';
      }

      if (val === 'web') {
        return 'Web';
      }

      if (val === 'landscape') {
        return 'A4 Landscape';
      }

      if (val === 'portrait') {
        return 'A4 Portrait';
      }

      return val;
    },
  },
  {
    key: 'reportCustomLayout',
    label: 'Web Resolution',
    onChange,
    options: [
      { label: '3840 x 2160', value: '3840x2160' },
      { label: '1920 x 1080', value: '1920x1080' },
      { label: '1440 x 900', value: '1440x900' },
      { label: '1366 x 768', value: '1366x768' },
      { label: '1280 x 720', value: '1280x720' },
      { label: '1024 x 768', value: '1024x768' },
    ],
    section: 'General',
    showWhen: {
      reportLayout: 'Web',
    },
    type: 'dropdown',
    uniqueId: 'reportCustomLayout_1',
    value,
  },
  {
    key: 'reportCustomLayout',
    label: 'Enter Dimensions',
    onChange,
    section: 'General',
    showWhen: {
      reportLayout: 'Custom',
    },
    type: 'layoutSizeSettings',
    uniqueId: 'reportCustomLayout_2',
    value,
  },
  {
    ...divider('General'),
  },
];
