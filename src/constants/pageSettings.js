import { divider, fieldSet } from '../utils/staticSettings';
import { PAGE_SETTINGS_ITEM_TYPE } from './itemTypes';

export const pageSettings = {
  settings: [
    {
      key: 'backgroundColor',
      label: 'Background Color',
      section: 'General',
      type: 'colorPicker',
    },
    {
      ...divider('General'),
    },
    {
      ...fieldSet('General', 'Page Elements'),
    },
    {
      key: 'pageLayer',
      label: '',
      section: 'General',
      type: 'pageLayer',
      value: (_, { items }) => JSON.stringify(items),
    },
  ],
};

export default {
  itemType: PAGE_SETTINGS_ITEM_TYPE,
  settings: pageSettings.settings,
};
