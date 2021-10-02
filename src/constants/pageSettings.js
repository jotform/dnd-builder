import { divider, fieldSet } from '../utils/staticSettings';
import { PAGE_SETTINGS_ITEM_TYPE } from './itemTypes';

export const pageSettings = {
  settings: [
    {
      key: 'backgroundColor',
      label: 'Background Color',
      section: 'GENERAL',
      type: 'colorPicker',
    },
    {
      ...divider('GENERAL'),
    },
    {
      ...fieldSet('GENERAL', 'Page Elements'),
    },
    {
      key: 'pageLayer',
      label: '',
      section: 'GENERAL',
      type: 'pageLayer',
      value: (_, { items }) => JSON.stringify(items),
    },
  ],
};

export default {
  itemType: PAGE_SETTINGS_ITEM_TYPE,
  settings: pageSettings.settings,
};
