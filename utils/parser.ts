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
  stack?: number;
  itemId?: string;
  quality?: number;
  basePrice?: number;
  chestColor?: string;
};

type RawGame = {
  player: any;
  [key: string]: any;
  locations: {
    GameLocation: any[];
  };
};

export type ParsedGame = {
  gameInfo: SaveGame;
  items: Item[];
};

export const parseXml = (xmlString: string): ParsedGame => {
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

    const items: Item[] = findItems(data);
    return {
      gameInfo,
      items,
    };
  } catch (ex) {
    throw new Error(ex);
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

export const forceAsArray = (obj) => {
  if (Array.isArray(obj)) {
    return obj;
  }
  if (typeof obj !== 'undefined') {
    return [obj];
  }
  return [];
};

export const isForageItem = (item) => {
  if (typeof item === 'number') {
    return forageItems.includes(item);
  }
  return forageItems.includes(item.parentSheetIndex) && !item.bigCraftable;
};

export function findHarvestInLocations(gameState, names = []) {
  const locations = gameState.locations.GameLocation.filter(({ name }) =>
    names.includes(name)
  );

  return locations.reduce((p, location) => {
    const tappers = filterObjectsByName(location, 'Tapper');
    const preservesJars = filterObjectsByName(location, 'Preserves Jar');
    const beeHouses = filterObjectsByName(location, 'Bee House');
    const eggs = [
      ...filterObjectsByName(location, 'Egg'),
      ...findInBuildings(location, 'Coop', ['Egg']),
    ];
    const kegs = [
      ...findInBuildings(location, 'Barn', ['Keg']),
      ...filterObjectsByName(location, 'Keg'),
    ];

    // Find fishponds

    const fishponds = (location.buildings
      ? location.buildings.Building
      : []
    ).filter((loc) => loc['@_xsi:type'] === 'FishPond');
    const roes = fishponds.reduce(
      (pp, c) => [
        ...pp,
        {
          x: c.tileX,
          y: c.tileY,
          dx: c.tilesWide,
          dy: c.tilesHigh,
          name: `Fish pond ${
            c.output.Item['@_xsi:nil'] === true ? '' : `(${c.output.Item.name})`
          }`,
          location: location.name,
          done: !c.output.Item['@_xsi:nil'],
          daysToHarvest: c.output.Item['@_xsi:nil'] ? '?' : 0,
          ...c,
        },
      ],
      []
    );
    const trees = forceAsArray(location.terrainFeatures.item)
      .filter((o) => o.value.TerrainFeature['@_xsi:type'] === 'FruitTree')
      .map((o) => ({
        ...o,
        name: `${REVERSE_ID_TABLE[o.value.TerrainFeature.indexOfFruit]} Tree`,
        daysToHarvest: Math.max(o.value.TerrainFeature.daysUntilMature, 0),
        done: o.value.TerrainFeature.fruitsOnTree > 0,
        x: o.key.Vector2.X,
        y: o.key.Vector2.Y,
        location: location.name,
      }));

    const forages = forceAsArray(location.objects.item)
      .filter((feature) => isForageItem(feature.value.Object))
      .map((forage) => ({
        ...forage,
        daysToHarvest: 0,
        location: location.name,
        x: forage.key.Vector2.X,
        y: forage.key.Vector2.Y,
        done: true,
        name: forage.value.Object.name,
      }));

    const crops = forceAsArray(location.terrainFeatures.item)
      .filter((feature) => feature.value.TerrainFeature.crop)
      .map((feature) => {
        const phaseDays = feature.value.TerrainFeature.crop.phaseDays.int;
        const { currentPhase } = feature.value.TerrainFeature.crop;
        const { dayOfCurrentPhase } = feature.value.TerrainFeature.crop;
        const { regrowAfterHarvest } = feature.value.TerrainFeature.crop;
        let daysToHarvest =
          phaseDays.slice(currentPhase + 1, -1).reduce((pp, c) => pp + c, 0) +
          phaseDays[currentPhase] -
          dayOfCurrentPhase;
        let done = false;
        if (currentPhase === phaseDays.length - 1) {
          // Check if done
          if (regrowAfterHarvest > 0) {
            if (
              dayOfCurrentPhase === -1 ||
              dayOfCurrentPhase === 0 ||
              dayOfCurrentPhase === regrowAfterHarvest
            ) {
              daysToHarvest = 0;
              done = true;
            } else {
              daysToHarvest = regrowAfterHarvest - dayOfCurrentPhase;
            }
          } else {
            done = true;
            daysToHarvest = 0;
          }
        }
        return {
          ...feature,
          name:
            REVERSE_ID_TABLE[feature.value.TerrainFeature.crop.indexOfHarvest],
          superName: feature.value.TerrainFeature['@_xsi:type'],
          daysToHarvest,
          done,
          dead: feature.value.TerrainFeature.crop.dead,
          x: feature.key.Vector2.X,
          y: feature.key.Vector2.Y,
          location: location.name,
        };
      });
    return [
      ...p,
      ...tappers,
      ...preservesJars,
      ...beeHouses,
      ...eggs,
      ...kegs,
      ...trees,
      ...crops,
      ...forages,
      ...roes,
    ];
  }, []);
}

const forageItems = [
  16,
  18,
  20,
  22,
  88,
  90,
  257,
  259,
  281,
  283,
  372,
  392,
  393,
  394,
  396,
  397,
  398,
  402,
  404,
  406,
  408,
  410,
  412,
  414,
  416,
  418,
  420,
  422,
  718,
  719,
  723,
];
