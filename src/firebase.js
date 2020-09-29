import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDt7ldXAl48gZLACHE2NRzAYFHRLMq3W9A",
  authDomain: "instagram-clone-9bdb0.firebaseapp.com",
  databaseURL: "https://instagram-clone-9bdb0.firebaseio.com",
  projectId: "instagram-clone-9bdb0",
  storageBucket: "instagram-clone-9bdb0.appspot.com",
  messagingSenderId: "737320969529",
  appId: "1:737320969529:web:b6a264c27beb6c464674e8",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
