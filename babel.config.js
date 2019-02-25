module.exports = {
  presets: [
    [
      "@vue/babel-preset-jsx",
      {
        functional: false
      }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],
}
