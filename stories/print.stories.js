import { Print } from '../src/index';
import {
  acceptedItems,
  leftPanelConfig,
  defaultSettings,
} from './config';
import examplePages from './config/examplePages';

export default {
  component: Print,
  parameters: {
    options: {
      showPanel: false,
    },
  },
  title: 'Examples/Print',
};

const Template = args => <Print {...args} />;

// Each story then reuses that template
export const Basic = Template.bind({});
Basic.args = {
  acceptedItems,
  leftPanelConfig,
  mode: 'print',
  pages: examplePages,
  settings: defaultSettings,
};
