import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';
import { themes } from '@storybook/theming';
import logo from './assets/logo.png';

const theme = create({
  base: 'light',
  brandImage: logo,
  brandTitle: 'Jotform DND Builder',
  brandUrl: 'https://github.com/jotform/dnd-builder',

  appBg: '#DFE7F2',
  colorSecondary: '#01BD6F',

  // Toolbar default and active colors
  barTextColor: '#888FA9',
  barSelectedColor: '#01BD6F',
});

addons.setConfig({
  // panelPosition: 'bottom',
  theme,
});
