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

export const getFarmState = async farm => {
  if (admin.apps.length === 0) {
    admin.initializeApp(config);
  }
  if (fileCache[farm]) {
    console.log('Using cache');
    return fileCache[farm];
  }
  const bucket = admin.storage().bucket();
  const f = await bucket.file(`farms/${farm}`).download();
  const output = JSON.parse(f.toString());
  const state = await goCrazyWithJson(output.SaveGame);
  fileCache[farm] = state;
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
