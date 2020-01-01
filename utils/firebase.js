// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

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

export const getStorage = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase.storage();
};
