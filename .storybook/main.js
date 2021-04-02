const path = require('path');

module.exports = {
  stories: [
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, '..', '.'),
      'node_modules',
    ];
    return config;
  },
};
