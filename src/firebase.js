import firebase from 'firebase';
import 'firebase/firestore';

require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDDNtoE0zVK0fW-DWsAa0RaOeug0lOmXTQ',
  authDomain: 'realtime-chat-38783.firebaseapp.com',
  databaseURL: 'https://realtime-chat-38783.firebaseio.com',
  projectId: 'realtime-chat-38783',
  storageBucket: 'realtime-chat-38783.appspot.com',
  messagingSenderId: '374810470667',
  appId: '1:374810470667:web:bed2904031c71fd5a11a0e',
  measurementId: 'G-7ES98L6NTK',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

window.db = db;

db.settings({
  timestampsInSnapshots: true,
});

export default db;
