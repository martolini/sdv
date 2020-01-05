import { MAP_SIZES, ID_TABLE, REVERSE_ID_TABLE } from './lookups';
import bundles from '../data/bundles.json';
import CSRandom from './csrandom';

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
  420,
  414,
  418,
  718,
  719,
  723,
];

export const isForageItem = item => forageItems.includes(item);

export const isValidLocation = name => Object.keys(MAP_SIZES).includes(name);

export async function goCrazyWithJson(json) {
  const info = {
    currentSeason: json.currentSeason,
    dayOfMonth: json.dayOfMonth,
    dailyLuck: json.dailyLuck,
    year: json.year,
    farmName: json.player.farmName,
    money: json.player.money,
    gameId: json.uniqueIDForThisGame,
  };
  info.id = `${info.gameId}-${info.year}-${info.currentSeason}-${info.dayOfMonth}`;
  // Parse locations
  const foraging = json.locations.GameLocation.filter(({ name }) =>
    isValidLocation(name)
  ).reduce((p, location) => {
    const name = location.name;
    location.objects = location.objects || { item: [] };
    location.objects = Array.isArray(location.objects.item)
      ? location.objects
      : { item: [location.objects.item] };
    p[name] = location.objects.item
      .map(item => {
        const itemId = item.value.Object.parentSheetIndex;
        if (!isForageItem(itemId)) {
          return null;
        }
        return {
          name: item.value.Object.name,
          x: item.key.Vector2.X,
          y: item.key.Vector2.Y,
        };
      })
      .filter(l => !!l);
    return p;
  }, {});
  if (typeof window !== 'undefined') {
    window.json = json;
  }
  // Generate bundle status
  const deliverableItems = getDeliverableItems(json);
  const bundleStatus = getBundleStatus(json);
  const missingBundleItems = Object.keys(bundles)
    .map(bundleKey => {
      const dataBundle = bundles[bundleKey];
      return {
        ...dataBundle,
        ...bundleStatus[dataBundle.id],
        missingIngredients: bundleStatus[dataBundle.id].missingIngredients.map(
          i => ({
            ...i,
            deliverable: canDeliverItem(
              deliverableItems,
              i.itemId,
              i.stack,
              i.quality
            ),
          })
        ),
      };
    })
    .filter(({ nMissing }) => nMissing > 0);
  return {
    gameState: json,
    foraging,
    mines: findMinesInfo(json),
    info,
    harvestOnFarm: findHarvestOnFarm(json),
    missingBundleItems,
    deliverableItems,
    players: getPlayers(json),
  };
}

const filterObjectsByName = (location, name) =>
  location.objects.item
    .filter(feature => feature.value.Object.name === name)
    .map(feature => {
      const {
        name,
        heldObject = { name: 'empty' },
        minutesUntilReady,
      } = feature.value.Object;
      const type = heldObject.name;
      const daysToHarvest = Math.round(minutesUntilReady / 60 / 24);
      return {
        ...feature,
        name: `${name} (${type})`,
        daysToHarvest,
        x: feature.key.Vector2.X,
        y: feature.key.Vector2.Y,
        done: minutesUntilReady === 0,
        hoursUntilReady: Math.round(minutesUntilReady / 60),
        minutesUntilReady,
      };
    });

const findInBuildings = (location, building, names = []) => {
  const buildings = location.buildings.Building.filter(
    b => building === b['@_xsi:type']
  );
  const allObjects = buildings.reduce((p, building) => {
    const objects = building.indoors.objects.item
      .filter(
        item => names.length === 0 || names.includes(item.value.Object.name)
      )
      .map(item => {
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
        };
      });
    return [...p, ...objects];
  }, []);

  return allObjects;
};

const findMinesInfo = json => {
  const quarryUnlocked = !!json.player.mailReceived.string.find(
    t => t === 'ccCraftsRoom'
  );
  const daysPlayed = json.player.stats.daysPlayed;
  const gameID = json.uniqueIDForThisGame;
  const infestedMonster = [];
  const infestedSlime = [];
  const quarryLevel = [];
  const rainbowLights = [];
  const dinoLevel = [];
  const day = daysPlayed;
  for (let mineLevel = 1; mineLevel < 120; mineLevel++) {
    if (mineLevel % 5 === 0) {
      continue;
    }
    let skipMushroomCheck = false;
    var rng = new CSRandom(day + mineLevel * 100 + gameID / 2);
    if (
      rng.NextDouble() < 0.044 &&
      mineLevel % 40 > 5 &&
      mineLevel % 40 < 30 &&
      mineLevel % 40 !== 19
    ) {
      if (rng.NextDouble() < 0.5) {
        infestedMonster.push(mineLevel);
      } else {
        infestedSlime.push(mineLevel);
      }
      skipMushroomCheck = true;
    } else if (
      rng.NextDouble() < 0.044 &&
      quarryUnlocked &&
      mineLevel % 40 > 1
    ) {
      if (rng.NextDouble() < 0.25) {
        quarryLevel.push(mineLevel + '*');
      } else {
        quarryLevel.push(mineLevel);
      }
      skipMushroomCheck = true;
    }
    if (skipMushroomCheck) {
      continue;
    }
    rng = new CSRandom(day * mineLevel + 4 * mineLevel + gameID / 2);
    if (rng.NextDouble() < 0.3 && mineLevel > 2) {
      rng.NextDouble(); // checked vs < 0.3 again
    }
    rng.NextDouble(); // checked vs < 0.15
    if (rng.NextDouble() < 0.035 && mineLevel > 80) {
      rainbowLights.push(mineLevel);
    }
  }
  for (let mineLevel = 127; mineLevel < 621; mineLevel++) {
    rng = new CSRandom(day + mineLevel * 100 + gameID / 2);
    if (rng.NextDouble() < 0.044) {
      rng.NextDouble(); // Unknown data
      if (rng.NextDouble() < 0.5) {
        dinoLevel.push(mineLevel - 120);
      }
    }
  }
  return {
    infestedMonster,
    infestedSlime,
    rainbowLights,
    quarryLevel,
    dinoLevel,
  };
};

export function findHarvestOnFarm(gameState) {
  const location = gameState.locations.GameLocation.find(
    ({ name }) => name === 'Farm'
  );
  const tappers = filterObjectsByName(location, 'Tapper');
  const preservesJars = filterObjectsByName(location, 'Preserves Jar');
  const beeHouses = filterObjectsByName(location, 'Bee House');
  const eggs = findInBuildings(location, 'Coop', ['Egg']);
  const kegs = findInBuildings(location, 'Barn', ['Keg']);
  const trees = location.terrainFeatures.item
    .filter(o => o.value.TerrainFeature['@_xsi:type'] === 'FruitTree')
    .map(o => ({
      ...o,
      name: `${REVERSE_ID_TABLE[o.value.TerrainFeature.indexOfFruit]} Tree`,
      daysToHarvest: Math.max(o.value.TerrainFeature.daysUntilMature, 0),
      done: o.value.TerrainFeature.fruitsOnTree > 0,
      x: o.key.Vector2.X,
      y: o.key.Vector2.Y,
    }));

  let crops = location.terrainFeatures.item
    .filter(feature => feature.value.TerrainFeature.crop)
    .map(feature => {
      const phaseDays = feature.value.TerrainFeature.crop.phaseDays.int;
      const currentPhase = feature.value.TerrainFeature.crop.currentPhase;
      const dayOfCurrentPhase =
        feature.value.TerrainFeature.crop.dayOfCurrentPhase;
      const regrowAfterHarvest =
        feature.value.TerrainFeature.crop.regrowAfterHarvest;
      let daysToHarvest =
        phaseDays.slice(currentPhase + 1, -1).reduce((p, c) => p + c, 0) +
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
      };
    });
  return [
    ...crops,
    ...tappers,
    ...preservesJars,
    ...beeHouses,
    ...eggs,
    ...trees,
    ...kegs,
  ];
}

const findPaths = (
  obj,
  searchValue,
  { searchKeys = typeof searchValue === 'string', maxDepth = 20 } = {}
) => {
  const paths = [];
  const notObject = typeof searchValue !== 'object';
  const gvpio = (obj, maxDepth, prefix) => {
    if (!maxDepth) return;

    for (const [curr, currElem] of Object.entries(obj)) {
      if (searchKeys && curr === searchValue) {
        // To search for property name too ...
        paths.push(prefix + curr);
      }

      if (typeof currElem === 'object') {
        // object is "object" and "array" is also in the eyes of "typeof"
        // search again :D
        gvpio(currElem, maxDepth - 1, prefix + curr + '/');
        if (notObject) continue;
      }
      // it's something else... probably the value we are looking for
      // compares with "searchValue"
      if (currElem === searchValue) {
        // return index AND/OR property name
        paths.push(prefix + curr);
      }
    }
  };
  gvpio(obj, maxDepth, '');
  return paths;
};

function calculatePrice(item) {
  switch (item.quality) {
    case 1:
      return Math.floor(item.price * 1.25);
    case 2:
      return Math.floor(item.price * 1.5);
    case 4:
      return Math.floor(item.price * 2);
    default:
      return item.price;
  }
}

function parseItem(item) {
  return {
    name: item.name,
    stack: item.stack,
    id: item.parentSheetIndex,
    quality: item.quality,
    price: calculatePrice(item),
    type: item.type,
  };
}

export const getDeliverableItems = gameState => {
  // Find player inventory
  const playerItems = gameState.player.items.Item.filter(
    item => item['@_xsi:nil'] !== true
  ).map(parseItem);

  // Find farmhands inventory
  const farmhands = findPaths(gameState, 'farmhand').map(path =>
    path.split('/').reduce((p, c) => p[c], gameState)
  );

  const farmhandItems = farmhands
    .map(farmhand => {
      const items = farmhand.items.Item;
      return items.filter(item => item['@_xsi:nil'] !== true).map(parseItem);
    })
    .reduce((p, c) => [...p, ...c], []);

  // Find all chests
  const chestItems = findPaths(gameState, 'playerChest')
    .map(path =>
      path
        .split('/')
        .slice(0, -1)
        .reduce((p, c) => p[c], gameState)
    )
    .map(chest => (chest.items === '' ? [] : chest.items.Item))
    .filter(chest => chest.length > 0)
    .map(chest => chest.map(parseItem))
    .reduce((p, c) => [...p, ...c], []);

  return [...playerItems, ...farmhandItems, ...chestItems].reduce((p, c) => {
    const key = c.id;
    const current = p[key];
    if (!current || current.length === 0) {
      p[key] = [c];
    } else {
      p[key] = [...p[key], c];
    }
    return p;
  }, {});
};

export const canDeliverItem = (deliverableItems, itemId, stack, quality) => {
  const items = deliverableItems[itemId] || [];
  if (
    items.reduce((p, c) => {
      if (c.quality >= quality) {
        return p + c.stack;
      }
      return p;
    }, 0) >= stack
  ) {
    return true;
  }
  return false;
};

const BUNDLE_COUNT = {
  // number of items in each bundle
  0: 4,
  1: 4,
  2: 4,
  3: 3,
  4: 5,
  5: 6,
  6: 4,
  7: 4,
  8: 4,
  9: 3,
  10: 4,
  11: 5,
  13: 4,
  14: 3,
  15: 4,
  16: 4,
  17: 4,
  19: 5,
  20: 3,
  21: 4,
  22: 2,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  31: 6,
  32: 4,
  33: 4,
  34: 6,
  35: 3,
};

export const getBundleStatus = gameState => {
  const ccLoc = gameState.locations.GameLocation.find(
    c => c.name === 'CommunityCenter'
  );

  const bundlesHave = ccLoc.bundles.item.reduce((p, item) => {
    const id = item.key.int;
    const count = item.value.ArrayOfBoolean.boolean.reduce((p, c) => p + c, 0);
    p[id] = count;
    return p;
  }, {});

  const stateBundles = ccLoc.bundles.item;
  const missing = Object.keys(bundles).reduce((p, bundleKey) => {
    const rawBundle = bundles[bundleKey];
    const bundle = stateBundles.find(b => +b.key.int === +rawBundle.id);
    const booleanArray = bundle.value.ArrayOfBoolean.boolean;
    const missingIngredients = rawBundle.ingredients.reduce((p, c, i) => {
      if (booleanArray[i]) {
        return p;
      }
      return [...p, c];
    }, []);
    p[bundleKey] = {
      missingIngredients,
      nMissing: Math.max(BUNDLE_COUNT[bundleKey] - bundlesHave[bundleKey], 0),
    };
    return p;
  }, {});
  return missing;
};

export function getPlayers(gameState) {
  const players = [
    gameState.player,
    ...findPaths(gameState, 'farmhand')
      .map(path => path.split('/').reduce((p, c) => p[c], gameState))
      .filter(t => t.name),
  ];
  return players.reduce((p, player) => {
    p[player.name] = player;
    return p;
  }, {});
}
