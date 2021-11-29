// const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = {
  stories: ['../stories/**/*.stories.@(js|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/preset-scss'
  ],
  webpackFinal: async config => {
    config.resolve.extensions.push('.svg');
  
    config.module.rules = config.module.rules.map( data => {
        if (/svg\|/.test( String( data.test ) ))
            data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;
  
        return data;
    });
  
    config.module.rules.push({
        test: /\.svg$/,
        use: [{ loader: require.resolve('babel-loader') },
              { loader: require.resolve('@svgr/webpack') }]
    });
  
    // config.module.rules.push({
    //   // 2a. Load `.stories.mdx` / `.story.mdx` files as CSF and generate
    //   //     the docs page from the markdown
    //   test: /(\.(stories|story)\.mdx$|\.mdx)/,
    //   use: [
    //     {
    //       loader: 'babel-loader',
    //       // may or may not need this line depending on your app's setup
    //       options: {
    //         plugins: ['@babel/plugin-transform-react-jsx'],
    //       },
    //     },
    //     {
    //       loader: '@mdx-js/loader',
    //       options: {
    //         compilers: [createCompiler({})],
    //       },
    //     },
    //   ],
    // });
  
    config.module.rules.push({
      test: /\.stories\.jsx?$/,
      loaders: [require.resolve('@storybook/source-loader')],
      enforce: 'pre',
    });
  
    return config;
  }
};