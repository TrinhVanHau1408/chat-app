import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDXdTqqtUetQPa72CMM_ney4b9lyU8aWnI",
    authDomain: "chat-app-a5b7d.firebaseapp.com",
    projectId: "chat-app-a5b7d",
    storageBucket: "chat-app-a5b7d.appspot.com",
    messagingSenderId: "641387353020",
    appId: "1:641387353020:web:09f5be889846f23449d1b9",
    measurementId: "G-9CGWVCD5RB"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.getAnalytics();

const auth = firebase.auth();
const db = firebase.firestore();

// Cấu hình auth localhost
auth.useEmulator('http://localhost:9099');

// Cấu hình database
if (window.location.hostname === 'localhost') {
  db.useEmulator('localhost', '8080');
}
export {db, auth};

export default firebase;