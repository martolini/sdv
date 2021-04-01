export type FarmItem = {
  name: string;
  daysToHarvest: number;
  dead: boolean;
  done: boolean;
} & Rect;

export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  width?: number;
  height?: number;
} & Point;
