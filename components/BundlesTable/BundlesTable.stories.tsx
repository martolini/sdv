import { Meta } from '@storybook/react';
import BundlesTable from './index';
import bundleInfoTestData from './bundleInfoTest';

export default {
  title: 'BundlesTable',
} as Meta;

export const Main = () => <BundlesTable bundleInfo={bundleInfoTestData} />;
export const Empty = () => <BundlesTable bundleInfo={[]} />;
