const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  outputDir: 'dist/ui',
  configureWebpack: {
    entry: {
      app: './src/ui.ts'
    },
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: path.join(__dirname, 'src/assets'),
        to: path.join(__dirname, 'dist/ui/assets'),
        toType: 'dir',
      }]),
    ],
  },
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    config
      .plugin('fork-ts-checker')
      .tap(args => {
        args[0].tsconfig = 'tsconfig.ui-vue.json';
        return args;
      });

    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.configFile = 'tsconfig.ui-vue.json';
        return options;
      });

    config.module
      .rule('tsx')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.configFile = 'tsconfig.ui-vue.json';
        return options;
      });

    config.module
      .rule('scss')
      .oneOf('vue-modules')
      .use('sass-loader')
      .loader('sass-loader')
      .tap(options => {
        options.includePaths = ['src/ui-styles'];
        return options;
      });

    config.module
      .rule('scss')
      .oneOf('vue')
      .use('sass-loader')
      .loader('sass-loader')
      .tap(options => {
        options.includePaths = ['src/ui-styles'];
        return options;
      });

    config.plugin('html')
      .tap(args => {
        args[0].template = path.join(__dirname, 'src/index.html');
        return args;
      });
  }
}
