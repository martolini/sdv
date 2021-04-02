import { defaultTheme } from 'evergreen-ui';
import { merge } from 'lodash';
import '@fontsource/vt323';

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
