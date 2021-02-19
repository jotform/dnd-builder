import React from 'react';
import { Preview } from '../src/index';
import { acceptedItems, defaultSettings } from './config';
import examplePages from './config/examplePages';

export default {
  component: Preview,
  parameters: {
    options: {
      showPanel: false,
    },
  },
  title: 'Examples/Preview',
};

const Template = args => <Preview {...args} />;

// Each story then reuses that template
export const Basic = Template.bind({});
Basic.args = {
  acceptedItems,
  pages: examplePages,
  settings: defaultSettings,
};
