import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default {
  signIn(email, password) {
    console.log('Authenticating with Firebase:', email);
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return userCredential.user.getIdToken().then((token) => {
          localStorage.setItem('authToken', token);
          return { success: true, token };
        });
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  },
  
  logout() {
    localStorage.removeItem('authToken'); 
    window.location.href = '/signin';
  },
};
