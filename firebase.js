

const firebaseConfig = {
  apiKey: "AIzaSyAbzTaicX23lSoLe9GUbR5RO1QauJhSQgc",
  authDomain: "sport-buddy-64571.firebaseapp.com",
  projectId: "sport-buddy-64571",
  storageBucket: "sport-buddy-64571.appspot.com",
  messagingSenderId: "1065224361151",
  appId: "1:1065224361151:web:4c11e8bf0d34f3abb1620a",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
