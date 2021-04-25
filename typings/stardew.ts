export type FarmItem = {
  name: string;
  daysToHarvest?: number;
  dead?: boolean;
  done?: boolean;
  location?: string;
} & Rect;

export type Map = {
  name: string;
  forage: ForageItem[];
};

type BundleReward = {
  id: number;
  name: string;
  stack: number;
};

export type Item = {
  name: string;
  stack?: number;
  itemId?: number | string;
  quality?: number;
  basePrice?: number;
  chestColor?: string;
  player?: string;
  deliverableInBundle?: boolean;
  type?: string;
  category?: number;
};

export type ForageItem = Item & Point;

export type Bundle = {
  id: string;
  roomName: string;
  bundleName: string;
  reward: BundleReward;
  ingredients: Item[];
  missingIngredients: Item[];
  itemCount: number;
  nMissing: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  width?: number;
  height?: number;
} & Point;