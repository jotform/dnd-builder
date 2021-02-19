import React from 'react';
import { Presentation } from '../src/index';
import { acceptedItems, defaultSettings } from './config';
import examplePages from './config/examplePages';

export default {
  component: Presentation,
  parameters: {
    options: {
      showPanel: false,
    },
  },
  title: 'Examples/Presentation',
};

const Template = args => <Presentation {...args} />;

// Each story then reuses that template
export const Basic = Template.bind({});
Basic.args = {
  acceptedItems,
  pages: examplePages,
  settings: defaultSettings,
};

export const AdditionalActions = Template.bind({});
AdditionalActions.args = {
  ...Basic.args,
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
};
