/* eslint-disable import/no-extraneous-dependencies */

const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
require('jest-canvas-mock');

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.shallow = Enzyme.shallow;
global.mount = Enzyme.mount;
global.render = Enzyme.render;
global.unmount = Enzyme.unmount;
