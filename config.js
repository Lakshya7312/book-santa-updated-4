import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAFnA4fkao814OUiW-57vjuS_LuUMFRZQg",
    authDomain: "book-santa-4b91b.firebaseapp.com",
    databaseURL: "https://book-santa-4b91b.firebaseio.com",
    projectId: "book-santa-4b91b",
    storageBucket: "book-santa-4b91b.appspot.com",
    messagingSenderId: "467194380901",
    appId: "1:467194380901:web:ba818617c01e19ab48fc8c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();