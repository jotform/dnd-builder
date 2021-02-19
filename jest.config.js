/* eslint-disable sort-keys */

module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: [
    require.resolve('./scripts/enzymeSetup.js'),
  ],
  setupFilesAfterEnv: [],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': require.resolve('babel-jest'),
    '^.+\\.(css|scss|sass|less)$': require.resolve('./scripts/cssTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|scss|sass|less|json)$)':
      require.resolve('./scripts/fileTransform.js'),
  },
  transformIgnorePatterns: ['node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^react-native$': 'react-native-web',
  },
};
