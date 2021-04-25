import App from '../pages/_app';
import { withNextRouter } from 'storybook-addon-next-router';

export const decorators = [
  (Story) => <App withLayout={false} Component={Story} />,
  withNextRouter,
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
