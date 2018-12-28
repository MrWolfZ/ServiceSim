module.exports = {
  outputDir: 'dist/ui-vue',
  configureWebpack: {
    entry: {
      app: './src/ui.ts'
    },
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  },
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    config
      .plugin('fork-ts-checker')
      .tap(args => {
        args[0].tsconfig = './tsconfig.ui-vue.json';
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
  }
}
