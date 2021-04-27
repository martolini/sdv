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
};

const buildSearchIndex = (parsedGame?: ParsedGame) => {
  const { items = [] } = parsedGame || {};
  // Build item stats grouped by name
  const groupedItems = groupBy(items, 'name');
  const dataset: Record<string, Partial<SearchEntry>> = {};
  for (const [key, items] of Object.entries(groupedItems)) {
    const entry = {
      chests: chain(items)
        .map((item) => item.chestColor)
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
    keys: ['name', 'href'],
  });
  return fuse;
};

export default function useSearch() {
  const { parsedGame } = useParsedGame();
  const searchIndex = useMemo(() => buildSearchIndex(parsedGame), [parsedGame]);
  return searchIndex;
}
