import { defaultTheme } from 'evergreen-ui';
import { merge } from 'lodash';

const theme = merge(defaultTheme, {
  typography: {
    fontFamilies: {
      display: 'VT323, monospace',
      ui: 'VT323, monospace',
      mono: 'VT323, monospace',
    },
  },
});

export default theme;
