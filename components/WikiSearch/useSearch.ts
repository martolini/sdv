import { ParsedGame } from 'utils/parser';
import Fuse from 'fuse.js';
import { chain, groupBy, minBy, uniqBy } from 'lodash';
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
    }
  }
  // Go through harvest to add context
  const groupedHarvest = groupBy(harvest, 'name');
  const cropsContext: Dataset = {};
  for (const [key, harvest] of Object.entries(groupedHarvest)) {
    const nextCropFinished = minBy(harvest, (h) => h.daysToHarvest)
      .daysToHarvest;
    cropsContext[key] = {
      nextCropFinished,
    };
  }

  // Merge contexts
  const finalDataset = dataset.map(({ name, href }) => {
    return {
      name,
      href,
      ...(itemContext[name] || {}),
      ...(cropsContext[name] || {}),
      ...(forageContext[name] || {}),
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
    ],
  });
  return fuse;
};

export default function useSearch() {
  const { parsedGame } = useParsedGame();
  const searchIndex = useMemo(() => buildSearchIndex(parsedGame), [parsedGame]);
  return searchIndex;
}
