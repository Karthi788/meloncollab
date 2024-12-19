import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCG1cO1_OR_FLFosc_UNjgmODl5BYiWjp0",
  authDomain: "collab-tool-b45d0.firebaseapp.com",
  projectId: "collab-tool-b45d0",
  storageBucket: "collab-tool-b45d0.appspot.com",
  messagingSenderId: "602568304643",
  appId: "1:602568304643:web:1de4f9ad4da0c38a4d0636"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;