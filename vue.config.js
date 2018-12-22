module.exports = {
  outputDir: 'dist/ui-vue',
  configureWebpack: {
    resolve: {
      alias: {
        '@': __dirname + '/src/ui-vue'
      }
    },
    entry: {
      app: './src/ui-vue/main.ts'
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
  }
}
