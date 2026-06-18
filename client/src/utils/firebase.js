import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "preppilot-70f08.firebaseapp.com",
  projectId: "preppilot-70f08",
  storageBucket: "preppilot-70f08.firebasestorage.app",
  messagingSenderId: "377549804684",
  appId: "1:377549804684:web:16b25373e0a550879917a9"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app) ;

const provider = new GoogleAuthProvider() 
export {auth , provider}