import { action, computed } from 'easy-peasy';

const storeModel = {
  showFirstTimeUse: false,
  setShowFirstTimeUse: action((state, payload) => {
    state.showFirstTimeUse = payload;
    return state;
  }),
  gameState: {
    // Full gamestate
  },
  foraging: {
    // Foraging info
  },
  mines: {
    // Mines info
  },
  info: {
    // General information
  },
  harvest: {
    // Data on what harvest are available on the farm. Used for the /farm route
    items: [],
    itemsInLocation: computed(state => location =>
      state.items.filter(item => item.location === location)
    ),
  },
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
