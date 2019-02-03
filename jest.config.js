module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: {
        presets: [
          '@vue/babel-preset-jsx',
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
        ],
      },
    },
  },
  roots: [
    '<rootDir>',
    '<rootDir>/src',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/*.spec.(ts|js)',
  ],
  testPathIgnorePatterns: [
    'vue.spec',
  ],
  setupFiles: [
    '<rootDir>/node_modules/core-js/fn/array/flat-map.js',
  ],
};
