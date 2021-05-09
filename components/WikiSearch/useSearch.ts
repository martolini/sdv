import { ParsedGame } from 'utils/parser';
import Fuse from 'fuse.js';
import { chain, groupBy, minBy, uniq, uniqBy } from 'lodash';
import { useMemo } from 'react';
import allWikiPages from 'data/allWikiPages';
import { useParsedGame } from 'hooks/useParsedGame';
import { Item } from 'typings/stardew';

export type SearchEntry = Item & {
  chests?: string[];
  stack?: number;
  qualities?: number[];
  players?: string[];
  isOnMaps?: string[];
  href: string;
  nextCropFinished?: number;
  amountInGround?: number;
  tags?: string[];
};

type Dataset = Record<string, Partial<SearchEntry>>;

const getReadableQuality = (quality: number) => {
  switch (quality) {
    case 0:
      return 'Normal';
    case 1:
      return 'Silver';
    case 2:
      return 'Gold';
    case 4:
      return 'Iridium';
    default:
      break;
  }
  return null;
};

const buildSearchIndex = (parsedGame?: ParsedGame) => {
  const { items = [], maps = [], harvest = [] } = parsedGame || {};
  // Build item stats grouped by name
  const dataset = uniqBy(allWikiPages, (p) => p.name.toLowerCase());
  const itemContext: Dataset = {};
  const groupedItems = groupBy(items, 'name');
  const tagsContext: Record<string, string[]> = {};
  const setTag = (key: string, value: string) => {
    const ctx = tagsContext[key] || [];
    ctx.push(value);
    tagsContext[key] = uniq(ctx);
  };
  for (const [key, items] of Object.entries(groupedItems)) {
    const entry = {
      chests: chain(items)
        .map((item) => `#${item.chestColor}`)
        .filter((color) => color !== undefined)
        .uniq()
        .value(),
      players: chain(items)
        .map((item) => item.player)
        .uniq()
        .filter((p) => !!p)
        .value(),
      stack: items.reduce((p, c) => p + c.stack, 0),
      qualities: chain(items)
        .map((i) => i.quality)
        .filter((i) => !!i)
        .uniq()
        .value(),
      qualityTags: chain(items)
        .map((i) => i.quality)
        .filter((i) => !!i)
        .uniq()
        .map(getReadableQuality)
        .value(),
    };
    itemContext[key] = entry;
    setTag(key, items[0].type);
    setTag(key, 'inventory');
  }
  // Forage context
  const forageContext: Dataset = {};
  for (const map of maps) {
    const forages = groupBy(map.forage, (f) => f.name);
    for (const [key, forage] of Object.entries(forages)) {
      const entry: Partial<SearchEntry> = forageContext[key] || {};
      entry.isOnMaps = [
        ...(entry.isOnMaps || []),
        `${map.name} (${forage.length})`,
      ];
      forageContext[key] = entry;
      setTag(key, 'forage');
    }
  }
  // Go through harvest to add context
  const groupedHarvest = groupBy(harvest, 'name');
  const cropsContext: Dataset = {};
  for (const [key, harvest] of Object.entries(groupedHarvest)) {
    const earliestFinishCrop = minBy(harvest, (h) => h.daysToHarvest);
    const context: Partial<SearchEntry> = {};
    if (earliestFinishCrop) {
      context.nextCropFinished = earliestFinishCrop.daysToHarvest;
    }
    const byMaps = groupBy(harvest, 'location');
    const isOnMaps = Object.entries(byMaps).map(
      ([key, harvestOnMap]) => `${key} (${harvestOnMap.length})`
    );
    cropsContext[key] = {
      ...context,
      amountInGround: harvest.length,
      isOnMaps,
    };
    setTag(key, 'harvest');
  }

  // Merge contexts
  const finalDataset = dataset.map(({ name, href }) => {
    const itemData = itemContext[name] || {};
    const cropsData = cropsContext[name] || {};
    const forageData = forageContext[name] || {};
    return {
      name,
      href,
      ...itemData,
      ...cropsData,
      ...forageData,
      tags: tagsContext[name],
    };
  });

  const fuse = new Fuse<SearchEntry>(finalDataset, {
    includeScore: true,
    keys: [
      {
        name: 'name',
        weight: 2,
      },
      'qualityTags',
      'isOnMaps',
      {
        name: 'tags',
        weight: 0.5,
      },
    ],
  });
  return fuse;
};

export default function useSearch() {
  const { parsedGame } = useParsedGame();
  const searchIndex = useMemo(() => buildSearchIndex(parsedGame), [parsedGame]);
  return searchIndex;
}
