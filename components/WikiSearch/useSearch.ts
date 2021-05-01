import { ParsedGame } from 'utils/parser';
import Fuse from 'fuse.js';
import { chain, groupBy } from 'lodash';
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
};

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
  const { items = [], maps = [] } = parsedGame || {};
  // Build item stats grouped by name
  const groupedItems = groupBy(items, 'name');
  const dataset: Record<string, Partial<SearchEntry>> = {};
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
      isOnMaps: maps
        .filter((m) => m.forage.find((forage) => forage.name === key))
        .map((m) => m.name),
    };
    dataset[key] = entry;
  }

  const finalDataset = chain(allWikiPages)
    .uniqBy(({ href }) => href.toLowerCase())
    .map((page) => ({
      ...page,
      ...(dataset[page.name] || {}),
    }))
    .value();

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
