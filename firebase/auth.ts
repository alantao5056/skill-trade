import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXec3fgJ19NJG9KNbekNbXmEE9h8ZnjEs",
  authDomain: "skill-trade-2093e.firebaseapp.com",
  projectId: "skill-trade-2093e",
  storageBucket: "skill-trade-2093e.firebasestorage.app",
  messagingSenderId: "272977260345",
  appId: "1:272977260345:web:b5a9efd056b8a3266b42e8",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
