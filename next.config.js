// next.config.js
const withCSS = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps');
const SentryCliPlugin = require('@sentry/webpack-plugin');

module.exports = withSourceMaps(
  withCSS({
    webpack(config) {
      const plugins = config.plugins || [];
      if (process.env.CI === 'true' || process.env.NODE_ENV === 'production') {
        plugins.push(
          new SentryCliPlugin({
            include: '.',
            ignoreFile: '.sentrycliignore',
            ignore: ['node_modules', 'next.config.js'],
          })
        );
      }
      config.plugins = plugins;
      return config;
    },
  })
);
