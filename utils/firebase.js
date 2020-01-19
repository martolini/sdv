// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { uniq } from 'lodash';

export const firebaseConfig = {
  apiKey: 'AIzaSyDcMbocz-KqX22h6-dc_-g5r7_2BjMHOR0',
  authDomain: 'stardew-help.firebaseapp.com',
  databaseURL: 'https://stardew-help.firebaseio.com',
  projectId: 'stardew-help',
  storageBucket: 'stardew-help.appspot.com',
  messagingSenderId: '37854511328',
  appId: '1:37854511328:web:c7839d06a8d98375ef9085',
  measurementId: 'G-2901BYNPJ7',
};

export const withInitializedFirebase = func => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  return func;
};

export const getStorage = withInitializedFirebase(() => firebase.storage());

export const getFirestore = withInitializedFirebase(() => firebase.firestore());

let currentUser = null;

export const authenticate = withInitializedFirebase(() => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user;
        resolve(user);
      } else {
        currentUser = null;
        reject();
      }
    });

    firebase.auth().signInAnonymously();
  });
});

export const addRecentlySeenId = withInitializedFirebase(async farmId => {
  const ref = firebase
    .firestore()
    .collection('users')
    .doc(currentUser.uid);
  const doc = await ref.get();
  const current = doc.exists ? doc.data().recents || [] : [];
  if (!farmId) {
    return current;
  }
  const newRecents = uniq([farmId, ...current]).slice(0, 5);
  await ref.set(
    {
      recents: newRecents,
    },
    { merge: true }
  );
  return newRecents;
});

export const getCurrentUser = withInitializedFirebase(
  () => firebase.auth().currentUser
);
