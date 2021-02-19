import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import "./main.scss";

const order = [
  'Documentation', ['About', 'Getting Started', 'Components', 'Items', 'Settings'],
  'Examples', ['Builder', 'Preview', 'Presentation', 'Print', 'All in One']
];

export const parameters = {
  options: {
    showPanel: true,
    panelPosition: 'bottom',
    storySort: {
      method: '',
      order,
    },
  },
  docs: {
    container: DocsContainer,
    page: DocsPage
  }
};

