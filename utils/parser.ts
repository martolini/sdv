import parser from 'fast-xml-parser';
import { findObjects } from './object-search';
import rgbhex from 'rgb-hex';

type SaveGame = {
  id: string;
  gameId: string;
  currentSeason: string;
  dayOfMonth: number;
  dailyLuck: number;
  year: number;
  farmName: string;
  money: number;
};

type Item = {
  name: string;
  stack: number;
  itemId: string;
  quality: number;
  basePrice: number;
  chestColor?: string;
};

type RawGame = {
  player: any;
  [key: string]: any;
  locations: {
    GameLocation: any[];
  };
};

export const parseXml = (xmlString: string) => {
  try {
    const data = parser.parse(xmlString, {
      parseAttributeValue: true,
      ignoreAttributes: false,
    }).SaveGame as RawGame;
    const gameInfo: SaveGame = {
      id: `${data.uniqueIDForThisGame}-${data.year}-${data.currentSeason}-${data.dayOfMonth}`,
      currentSeason: data.currentSeason,
      dayOfMonth: data.dayOfMonth,
      dailyLuck: data.dailyLuck,
      year: data.year,
      farmName: data.player.farmName,
      money: data.player.money,
      gameId: data.uniqueIDForThisGame,
    };

    const items = findItems(data);
    return {
      gameInfo,
      items,
    };
  } catch (ex) {
    console.error(ex);
  }
};

const parseItem = (item: any): Item => ({
  name: item.name,
  stack: item.stack,
  itemId: item.parentSheetIndex,
  quality: item.quality,
  basePrice: item.price,
});

const findItems = (saveGame: RawGame) => {
  const playerItems = saveGame.player.items.Item.filter(
    (item) => item['@_xsi:nil'] !== true
  ).map(parseItem) as Item[];

  const farmhands = findObjects(saveGame.locations, 'farmhand').filter(
    (player) => player.name
  );

  const farmhandsItems = farmhands
    .map((hand) =>
      hand.items.Item.filter((item) => item['@_xsi:nil'] !== true).map(
        parseItem
      )
    )
    .flat() as Item[];

  const chestItems = findObjects(saveGame.locations, 'playerChest', 1)
    .filter((chest) => (chest.items === '' ? [] : chest.items.Item).length > 0)
    .map((chest) =>
      chest.items.Item.map((c) => ({
        ...parseItem(c),
        chestColor: parseChestColor(chest.playerChoiceColor),
      }))
    )
    .flat();
  return [...playerItems, ...farmhandsItems, ...chestItems];
};

type ChestColor = {
  R: number;
  G: number;
  B: number;
  A: number;
};

const parseChestColor = (chestColor: ChestColor) => {
  const { R, G, B, A } = chestColor;
  return rgbhex(R, G, B, A / 255);
};

function findHarvestInLocation(saveGame: RawGame, locationString: string) {
  const location = saveGame.locations.GameLocation.filter(
    ({ name }) => name === locationString
  );

  console.log(location);
}
