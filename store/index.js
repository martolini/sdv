import { createStore, action } from 'easy-peasy';

const storeModel = {
  gameState: {
    // Full gamestate
  },
  foraging: {
    // Foraging info
  },
  info: {
    // General information
  },
  harvestOnFarm: [
    // Data on what harvest are available on the farm. Used for the /farm route
  ],
  missingBundleItems: [
    // Data about the missing bundles.
  ],
  deliverableItems: [
    // Items that are available for delivery. Can be inside chests and inventory
  ],
  players: {
    // Data about the players (including farmhands)
  },
  setFullState: action((state, payload) => {
    return payload;
  }),
};

export default storeModel;
