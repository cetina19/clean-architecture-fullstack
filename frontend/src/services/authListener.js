import { auth } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import router from '@/router/index';

const setupAuthListener = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const existingToken = localStorage.getItem("authToken");

        if (existingToken) {
          const idToken = await user.getIdToken(true);
          localStorage.setItem("authToken", idToken);
        }
      } catch (error) {
        console.error("Error refreshing ID token:", error);
      }
    } else {
      localStorage.removeItem("authToken");
      router.push({ name: 'SignIn' });
    }
  });
};

export { setupAuthListener };
