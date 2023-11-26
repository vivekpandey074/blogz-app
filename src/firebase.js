import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import {getAuth} from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyBirsJeICGae6wjJaxi_vJtHqsqwK63YM4",
    authDomain: "react-blogz-app.firebaseapp.com",
    projectId: "react-blogz-app",
    storageBucket: "react-blogz-app.appspot.com",
    messagingSenderId: "472391185466",
    appId: "1:472391185466:web:d3bec6619eb82cbbf07103",
    measurementId: "G-SSSHRT99C2"
  };


  const app=initializeApp(firebaseConfig);
  const auth=getAuth(app);
  const db=getFirestore(app);
  const storage=getStorage(app);

export {auth,db,storage};