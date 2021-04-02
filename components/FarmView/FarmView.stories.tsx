import { Meta } from '@storybook/react';
import FarmView from './index';
export default {
  title: 'FarmView',
} as Meta;

const testData = [
  {
    name: 'Tapper (Maple Syrup)',
    daysToHarvest: 4,
    x: 20,
    y: 28,
    done: false,
    dead: false,
  },
  {
    name: 'Strawberry',
    daysToHarvest: 1,
    x: 65,
    y: 31,
    done: false,
    dead: false,
  },
  {
    name: 'Strawberry',
    daysToHarvest: 0,
    done: true,
    dead: false,
    x: 66,
    y: 31,
  },
];

export const Main = () => <FarmView items={testData} />;
