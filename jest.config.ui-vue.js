module.exports = {
  globals: {
    'vue-jest': {
      tsConfig: process.cwd() + '/tsconfig.ui-vue.json',
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
    'vue',
    'ts',
    'tsx',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/src/**/*.vue.spec.(js|jsx|ts|tsx)',
  ],
  testURL: 'http://localhost/',
};
