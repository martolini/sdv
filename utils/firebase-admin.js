import { goCrazyWithJson } from '../utils/stardew';
let admin;
let config = {};

if (typeof window === 'undefined') {
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
    return fileCache[farm];
  }
  const bucket = admin.storage().bucket();
  const f = await bucket.file(`farms/${farm}`).download();
  const output = JSON.parse(f.toString());
  const state = await goCrazyWithJson(output.SaveGame);
  fileCache[farm] = state;
  return state;
};

export default admin;
