module.exports = {
  roots: [
    '<rootDir>',
    '<rootDir>/src',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/src/**/*.spec.(ts|js)',
  ],
  testPathIgnorePatterns: [
    '/src/ui/',
    'vue.spec',
  ],
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/node_modules/core-js/fn/array/flat-map.js',
  ],
};
