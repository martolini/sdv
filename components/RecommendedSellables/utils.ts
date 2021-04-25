import { groupBy } from 'lodash';
import { ParsedGame } from 'utils/parser';
import { Item } from 'typings/stardew';
import { sellingQuantifier } from 'utils/stardew-helpers';

type SellableItem = Item & {
  price: number;
  key: string;
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
  const recommended = sellableItems.filter(
    (item) => !bundleItems[item.itemId] && !['Furniture'].includes(item.type)
  );
  const groupedRecommendations = groupBy(
    recommended,
    (i) => `${i.itemId}_${i.quality}`
  );
  const result = Object.entries(groupedRecommendations)
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
    .flat();
  return result.sort((a, b) => b.price - a.price);
};
