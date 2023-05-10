import {
  RichText, Image, Shapes, Chart, Icon,
} from '../../src/index';

export const defaultSettings = {
  reportAlignment: 'left',
  reportBackgroundColor: '#FFFFFF',
  reportFontColor: '#000000',
  reportFontFamily: 'Roboto',
  reportFontSize: '14',
  reportFontStyle: '[]',
  reportLayout: 'landscape',
  reportSize: '16:9',
};

export const responsiveSettings = {
  reportAlignment: 'left',
  reportBackgroundColor: '#FFFFFF',
  reportFontColor: '#000000',
  reportFontFamily: 'Roboto',
  reportFontSize: '14',
  reportFontStyle: '[]',
  reportLayout: 'responsive',
  reportLayoutHeight: 896,
  reportLayoutWidth: 414,
};

export const leftPanelConfig = [{
  elements: [
    {
      iconType: 'textElement',
      itemType: RichText.itemType,
      title: 'Text',
    },
    {
      iconType: 'image',
      itemType: Image.itemType,
      title: 'Image',
    },
    {
      iconType: 'shapes',
      itemType: Shapes.itemType,
      title: 'Shapes',
    },
    {
      iconType: 'bar',
      itemType: Chart.itemType,
      title: 'Chart',
    },
    {
      iconType: 'icon',
      itemType: Icon.itemType,
      title: 'Icon',
    },
  ],
  title: 'Elements',
}];

export const acceptedItems = {
  [RichText.itemType]: RichText,
  [Image.itemType]: Image,
  [Shapes.itemType]: Shapes,
  [Chart.itemType]: Chart,
  [Icon.itemType]: Icon,
};

export function safeJSONParse(str, defVal = {}) {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (ex) {
      return defVal;
    }
  } else {
    return defVal;
  }
}
