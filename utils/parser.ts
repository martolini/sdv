import parser from 'fast-xml-parser';
import { findObjects } from './object-search';
import rgbhex from 'rgb-hex';
import {
  ID_TABLE,
  SKILL_TABLE,
  EXP_TABLE,
  PROFESSIONS_TABLE,
  FORAGE_ITEMS,
  TREE_TYPES,
} from './lookups';
import { FarmItem, Item, Bundle, Map } from 'typings/stardew';
import bundles from 'data/bundles';

type SaveGame = {
  id: string;
  gameId: string;
  currentSeason: string;
  dayOfMonth: number;
  dailyLuck: number;
  year: number;
  farmName: string;
  money: number;
  weekday: string;
};

type RawGame = {
  player: any;
  [key: string]: any;
  locations: {
    GameLocation: any[];
  };
};

export type Tree = {
  treeType: number;
  location: string;
};

export type ParsedGame = {
  gameInfo: SaveGame;
  items: Item[];
  harvest: FarmItem[];
  bundleInfo: Bundle[];
  players: Player[];
  todaysBirthday?: Birthday;
  maps: Map[];
  trees: Tree[];
};

export type Birthday = {
  name: string;
  season: string;
  day: string;
};

const getBundleStatus = (gameState: RawGame) => {
  const ccLoc = gameState.locations.GameLocation.find(
    (c) => c.name === 'CommunityCenter'
  );

  const bundlesHave = ccLoc.bundles.item.reduce((p, item) => {
    const id = item.key.int;
    const count = item.value.ArrayOfBoolean.boolean.reduce(
      (pp, c) => pp + c,
      0
    );
    return {
      ...p,
      [id]: count,
    };
  }, {});

  const stateBundles = ccLoc.bundles.item;
  const missing = Object.keys(bundles).reduce((p, bundleKey) => {
    const rawBundle: Bundle = bundles[bundleKey];
    const bundle = stateBundles.find((b) => +b.key.int === +bundleKey);
    const booleanArray = bundle.value.ArrayOfBoolean.boolean;
    const missingIngredients: Item[] = rawBundle.ingredients.reduce(
      (pp, c, i) => {
        if (booleanArray[i]) {
          return pp;
        }
        return [...pp, c];
      },
      []
    );
    return {
      ...p,
      [bundleKey]: {
        missingIngredients,
        nMissing: Math.max(+rawBundle.itemCount - bundlesHave[bundleKey], 0),
      },
    };
  }, {});
  return missing;
};

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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
      dailyLuck: Math.round(((+data.dailyLuck + 0.1) / 0.2) * 100),
      year: data.year,
      farmName: data.player.farmName,
      money: data.player.money,
      gameId: data.uniqueIDForThisGame,
      weekday: DAYS[(data.dayOfMonth - 1) % 7],
    };

    const items: Item[] = findItems(data);
    return {
      gameInfo,
      items,
      harvest: findHarvestInLocations(data),
      trees: findTrees(data),
      bundleInfo: findMissingBundleItems(data, items),
      players: getPlayers(data),
      todaysBirthday: findTodaysBirthday(data),
      maps: findMapData(data),
    };
  } catch (ex) {
    throw new Error(ex);
  }
};

function findMapData(saveGame: RawGame): Map[] {
  const gameLocations = saveGame.locations.GameLocation;
  return gameLocations.map((location) => {
    const items = forceAsArray(location.objects.item).filter((item) =>
      isForageItem(+item.value.Object.parentSheetIndex)
    );
    return {
      name: location.name,
      forage: items.map((item) => ({
        ...parseItem(item.value.Object),
        x: item.key.Vector2.X,
        y: item.key.Vector2.Y,
      })),
    };
  });
}

function findTrees(saveGame: RawGame) {
  const gameLocations = saveGame.locations.GameLocation;
  const trees = [];
  for (const location of gameLocations) {
    trees.push(
      ...forceAsArray(location.terrainFeatures.item)
        .filter((o) => o.value.TerrainFeature['@_xsi:type'] === 'Tree')
        .map((o) => ({
          name: `${TREE_TYPES[o.value.TerrainFeature.treeType]}`,
          done: o.value.TerrainFeature.growthStage === 4,
          location: location.name,
          treeType: o.value.TerrainFeature.treeType,
          growthStage: o.value.TerrainFeature.growthStage,
        }))
    );
  }
  return trees;
}

function findMissingBundleItems(saveGame: RawGame, items: Item[]): Bundle[] {
  const bundleStatus = getBundleStatus(saveGame);
  return Object.keys(bundles).map((bundleKey) => {
    const dataBundle = bundles[bundleKey];
    return {
      missingIngredients: bundleStatus[bundleKey].missingIngredients.map(
        (i) => ({
          ...i,
          deliverableInBundle:
            (
              items.find(
                (i2) => i.itemId === i2.itemId && i2.quality >= i.quality
              ) || {}
            ).stack >= i.stack,
        })
      ),
      nMissing: bundleStatus[bundleKey].nMissing,
      ...dataBundle,
    };
  });
}

function findTodaysBirthday(saveGame: RawGame): Birthday {
  return findObjects(saveGame.locations.GameLocation, 'NPC')
    .reduce((p, c) => [...p, ...forceAsArray(c)], [])
    .filter(
      (c) =>
        c.birthday_Season &&
        c.birthday_Season === saveGame.currentSeason &&
        c.birthday_Day &&
        c.birthday_Day === saveGame.dayOfMonth
    )
    .map((c) => ({
      name: c.name,
      season: c.birthday_Season,
      day: c.birthday_Day,
    }))[0];
}

const parseItem = (item: any): Item => ({
  name: item.name,
  stack: +item.stack || 1,
  itemId:
    item.parentSheetIndex !== undefined
      ? item.parentSheetIndex
      : `${item['@_xsi:type']}_${
          item.parentSheetIndex ||
          item.currentParentTileIndex ||
          item.initialParentTileIndex ||
          item.indexInTileSheet ||
          item.which
        }`,
  quality: item.quality,
  basePrice: item.price,
  type: item['@_xsi:type'],
  category: item.category,
});

const findItems = (saveGame: RawGame) => {
  const playerItems = saveGame.player.items.Item.filter(
    (item) => item['@_xsi:nil'] !== true
  ).map((i) => ({ ...parseItem(i), player: saveGame.player.name })) as Item[];
  const farmhands = findObjects(saveGame.locations, 'farmhand').filter(
    (player) => player.name
  );

  const farmhandsItems = farmhands
    .map((hand) =>
      hand.items.Item.filter((item) => item['@_xsi:nil'] !== true).map((i) => ({
        ...parseItem(i),
        player: hand.name,
      }))
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

export const isForageItem = (item: any) => {
  if (typeof item === 'number') {
    return FORAGE_ITEMS.includes(item);
  }
  return FORAGE_ITEMS.includes(item.parentSheetIndex) && !item.bigCraftable;
};

export function findHarvestInLocations(
  gameState: RawGame,
  names: string[] = []
): FarmItem[] {
  const locations = gameState.locations.GameLocation.filter(
    ({ name }) => names.length === 0 || names.includes(name)
  );

  return locations.reduce((p, location) => {
    const nameLocationMapper = (obj) => ({
      location: location.name,
      name: obj.value.Object.name,
    });
    const tappers = filterObjectsByName(location, 'Tapper')
      // .filter((o) => {
      //   console.log(o);
      //   return true;
      // })
      .map(nameLocationMapper);
    const preservesJars = filterObjectsByName(location, 'Preserves Jar').map(
      nameLocationMapper
    );
    const beeHouses = filterObjectsByName(location, 'Bee House').map(
      nameLocationMapper
    );
    const artifactSpots = filterObjectsByName(location, 'Artifact Spot').map(
      nameLocationMapper
    );
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
          width: c.tilesWide,
          height: c.tilesHigh,
          name: `Fish pond ${
            c.output.Item['@_xsi:nil'] === true ? '' : `(${c.output.Item.name})`
          }`,
          location: location.name,
          done: !c.output.Item['@_xsi:nil'],
          daysToHarvest: c.output.Item['@_xsi:nil'] ? '?' : 0,
        } as FarmItem,
      ],
      []
    );
    const fruitTrees = forceAsArray(location.terrainFeatures.item)
      .filter((o) => o.value.TerrainFeature['@_xsi:type'] === 'FruitTree')
      .map((o) => ({
        name: `${ID_TABLE[o.value.TerrainFeature.indexOfFruit]} Tree`,
        daysToHarvest: Math.max(o.value.TerrainFeature.daysUntilMature, 0),
        done: o.value.TerrainFeature.fruitsOnTree > 0,
        x: o.key.Vector2.X,
        y: o.key.Vector2.Y,
        location: location.name,
      }));

    const forages = forceAsArray(location.objects.item)
      .filter((feature) => isForageItem(feature.value.Object))
      .map((forage) => ({
        daysToHarvest: 0,
        location: location.name,
        x: forage.key.Vector2.X,
        y: forage.key.Vector2.Y,
        done: true,
        name: forage.value.Object.name,
        width: forage.tilesWide,
        height: forage.tilesHigh,
        category: 'forage',
      }));

    const crops: FarmItem[] = forceAsArray(location.terrainFeatures.item)
      .filter((feature) => feature.value.TerrainFeature.crop)
      .map((feature) => {
        const phaseDays = feature.value.TerrainFeature.crop.phaseDays.int;
        const {
          dayOfCurrentPhase,
          currentPhase,
          regrowAfterHarvest,
        } = feature.value.TerrainFeature.crop;
        let daysToHarvest =
          phaseDays &&
          phaseDays.slice(currentPhase + 1, -1).reduce((pp, c) => pp + c, 0) +
            phaseDays[currentPhase] -
            dayOfCurrentPhase;
        let done = !phaseDays;
        if (phaseDays && currentPhase === phaseDays.length - 1) {
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
          name: ID_TABLE[feature.value.TerrainFeature.crop.indexOfHarvest],
          superName: feature.value.TerrainFeature['@_xsi:type'],
          daysToHarvest,
          done,
          dead: feature.value.TerrainFeature.crop.dead,
          x: feature.key.Vector2.X,
          y: feature.key.Vector2.Y,
          width: feature.tilesWide,
          height: feature.tilesHigh,
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
      ...fruitTrees,
      ...crops,
      ...forages,
      ...roes,
      ...artifactSpots,
    ];
  }, []);
}
const filterObjectsByName = (location, name) =>
  forceAsArray(location.objects.item)
    .filter((feature) => feature.value.Object.name === name)
    .map((feature) => {
      const {
        name: featureName,
        heldObject = { name: 'empty' },
        minutesUntilReady,
      } = feature.value.Object;
      const type = heldObject.name;
      const daysToHarvest = Math.round(minutesUntilReady / 60 / 24);
      return {
        ...feature,
        name: `${featureName} (${type})`,
        daysToHarvest,
        x: feature.key.Vector2.X,
        y: feature.key.Vector2.Y,
        done: minutesUntilReady === 0,
        hoursUntilReady: Math.round(minutesUntilReady / 60),
        minutesUntilReady,
        location: location.name,
      };
    });

const findInBuildings = (location, building, names = []) => {
  if (!location.buildings) {
    return [];
  }
  if (!Array.isArray(location.buildings.Building)) {
    location.buildings.Building = [location.buildings.Building];
  }
  const buildings = location.buildings.Building.filter(
    (b) => building === b['@_xsi:type']
  );
  const allObjects = buildings.reduce((p, b) => {
    if (!b.indoors.objects.item) {
      return p;
    }
    const objects = forceAsArray(b.indoors.objects.item)
      .filter(
        (item) => names.length === 0 || names.includes(item.value.Object.name)
      )
      .map((item) => {
        const { name, minutesUntilReady, heldObject } = item.value.Object;
        const daysToHarvest = Math.round(minutesUntilReady / 60 / 24);
        return {
          ...item,
          name: heldObject ? `${name} (${heldObject.name})` : name,
          daysToHarvest,
          x: item.key.Vector2.X,
          y: item.key.Vector2.Y,
          done: minutesUntilReady === 0,
          hoursUntilReady: Math.round(minutesUntilReady / 60),
          minutesUntilReady,
          location: location.name,
        };
      });
    return [...p, ...objects];
  }, []);

  return allObjects;
};

export type Player = {
  name: string;
  skills: Skill[];
};

export type Skill = {
  name: string;
  level: number;
  percentageToNextLevel: number;
  professions: {
    name: string;
    description: string;
  }[];
};

function getPlayers(gameState): Player[] {
  return [
    gameState.player,
    ...findObjects(gameState, 'farmhand').filter((f) => f.name !== ''),
  ].map((player) => {
    const experiencePoints = player.experiencePoints.int;
    // find skills per level
    const skills: Skill[] = Object.entries(SKILL_TABLE).map(
      ([key, skillName]) => {
        const stateKey = `${skillName.toLowerCase()}Level`;
        const level = player[stateKey];
        const exp = EXP_TABLE[level];
        const nextExp = EXP_TABLE[level + 1];
        const percentage =
          level === 10
            ? 100
            : ((experiencePoints[key] - exp) / (nextExp - exp)) * 100;
        const professions = forceAsArray(player.professions.int)
          .filter((prof) => !!PROFESSIONS_TABLE[skillName][prof])
          .map((prof) => PROFESSIONS_TABLE[skillName][prof])
          .map((prof) => ({
            name: prof.name,
            description: prof.description,
          }));
        return {
          name: skillName as string,
          level: +level,
          percentageToNextLevel: percentage,
          professions,
        };
      }
    );
    return {
      name: player.name,
      skills,
    };
  });
}
