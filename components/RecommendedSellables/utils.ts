import { groupBy } from 'lodash';
import { ParsedGame } from 'utils/parser';
import { Item } from 'typings/stardew';

type SellableItem = Item & {
  price: number;
  key: string;
};

const sellingQuantifier = (quality: number = 0) => {
  switch (quality) {
    case 0:
      return 1;
    case 1:
      return 1.25;
    case 2:
      return 1.5;
    case 4:
      return 2;
    default:
      throw new Error(`Unknown quality: ${quality}`);
  }
};
export const calculateRecommendedSellables = (
  parsedGame: ParsedGame
): SellableItem[] => {
  const { items, bundleInfo } = parsedGame;
  const sellableItems = items.filter((i) => i.basePrice > 0);
  const bundleItems = bundleInfo.reduce((p, bundle) => {
    bundle.missingIngredients.forEach((ing) => {
      p[ing.itemId] = ing;
    });
    return p;
  }, {});
  const recommended = sellableItems.filter((item) => !bundleItems[item.itemId]);
  const groupedRecommendations = groupBy(
    recommended,
    (i) => `${i.itemId}_${i.quality}`
  );
  return Object.entries(groupedRecommendations)
    .reduce((p, [key, items]) => {
      const first = items[0];
      return [
        ...p,
        {
          name: first.name,
          stack: items.reduce((p, c) => p + c.stack, 0),
          price: items.reduce(
            (pp, item) =>
              pp +
              item.basePrice * sellingQuantifier(item.quality) * item.stack,
            0
          ),
          quality: first.quality,
          itemId: first.itemId,
          key,
        },
      ];
    }, [])
    .flat()
    .sort((a, b) => b.price - a.price);
};
