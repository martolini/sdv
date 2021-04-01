import { Meta } from '@storybook/react';
import SiteLayout from './';

export default {
  title: 'SiteLayout',
} as Meta;

export const Default = () => (
  <SiteLayout>
    <h1>I am the content</h1>
  </SiteLayout>
);
