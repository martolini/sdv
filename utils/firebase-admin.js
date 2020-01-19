import { goCrazyWithJson } from './stardew';

// eslint-disable-next-line import/no-mutable-exports
let admin;
let config = {};

if (typeof window === 'undefined') {
  // eslint-disable-next-line global-require
  admin = require('firebase-admin');
  config = {
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://stardew-help.firebaseio.com',
    storageBucket: 'stardew-help.appspot.com',
  };
}

const fileCache = {};

export const getFarmState = async farmId => {
  const farmname = farmId || '123456789-2-spring-22'; // Show sample file if no ID is requested
  if (admin.apps.length === 0) {
    admin.initializeApp(config);
  }
  if (fileCache[farmname]) {
    console.log('Using cache');
    return fileCache[farmname];
  }
  const bucket = admin.storage().bucket();
  const f = await bucket.file(`farms/${farmname}`).download();
  const output = JSON.parse(f.toString());
  const state = await goCrazyWithJson(output.SaveGame);
  fileCache[farmname] = state;
  if (!farmId) {
    state.showFirstTimeUse = true;
  }
  return state;
};

export const addRecentlySeenId = async (uid, farmId) => {
  if (admin.apps.length === 0) {
    admin.initializeApp(config);
  }

  const ref = admin
    .firestore()
    .collections('users')
    .doc(uid)
    .collections('recents');
  const data = await ref.get().get();
  const current = data.data() || [];
  await ref.set([farmId, ...current].slice(0, 5));
};

export default admin;
