import { defaultTheme } from 'evergreen-ui';
import { merge } from 'lodash';

const theme = merge(defaultTheme, {
  typography: {
    fontFamilies: {
      display: 'VT323',
      ui: 'VT323',
      mono: 'VT323',
    },
  },
});

export default theme;
