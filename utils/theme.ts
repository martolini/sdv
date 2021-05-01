import { defaultTheme, Theme } from 'evergreen-ui';
import { merge } from 'lodash';

const theme = merge(defaultTheme, {
  typography: {
    fontFamilies: {
      // display: 'VT323',
      // ui: 'VT323',
      // mono: 'VT323',
    },
  },
} as Partial<Theme>);

export default theme;
