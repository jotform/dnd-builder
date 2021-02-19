import config from './rollup.prod.config';

config.plugins.pop(); // remove delete

config.watch = {
  chokidar: false,
  clearScreen: false,
  include: 'src/**',
};

export default config;
