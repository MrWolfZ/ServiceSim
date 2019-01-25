module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      'styled-jsx/babel',
      {
        plugins: [
          [
            'styled-jsx-plugin-sass',
            {
              sassOptions: {
                includePaths: ['src/ui-styles'],
              },
            },
          ],
        ],
      },
    ],
  ],
};
