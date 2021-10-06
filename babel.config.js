module.exports = function createConfig(api) {
  const config = {
    plugins: [
      [require.resolve('@babel/plugin-proposal-class-properties')],
      [require.resolve('@babel/plugin-proposal-export-default-from')],
      [require.resolve('@babel/plugin-proposal-export-namespace-from')],
      [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator')],
      [require.resolve('@babel/plugin-proposal-object-rest-spread')],
      [require.resolve('@babel/plugin-proposal-optional-chaining')],
      [require.resolve('@babel/plugin-syntax-dynamic-import')],
      [require.resolve('@babel/plugin-proposal-private-methods')],
    ],
    presets: [],
  };

  if (api.env('test')) {
    config.plugins.push([require.resolve('babel-plugin-dynamic-import-node')]);
    config.presets.push([
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
      },
    ]);
  } else {
    config.presets.push([
      require.resolve('@babel/preset-env'),
      {
        corejs: {
          proposals: true,
          version: 3,
        },
        useBuiltIns: 'usage',
      },
    ]);
  }

  config.presets.push([require.resolve('@babel/preset-react'), { runtime: 'automatic' }]);

  return config;
};
