import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCx0ZF4QBO0oy9icA81rtJkOUM33NkNb6o",
  authDomain: "plypicker-e35d7.firebaseapp.com",
  projectId: "plypicker-e35d7",
  storageBucket: "plypicker-e35d7.appspot.com",
  messagingSenderId: "13945101893",
  appId: "1:13945101893:web:89fd6d3f8e76e4bf234d2c",
  measurementId: "G-49REZLLEJS"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);