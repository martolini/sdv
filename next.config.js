const SentryCliPlugin = require('@sentry/webpack-plugin');

module.exports = {
  future: {
    webpack5: true,
  },
  plugins: [
    new SentryCliPlugin({
      include: '.',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'next.config.js'],
      configFile: 'sentry.properties',
    }),
  ],
};
