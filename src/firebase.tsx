// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA7504AmvTJ68yZno8AlnQ3LiiwSfOSUTs',
  authDomain: 'where-it-go.firebaseapp.com',
  projectId: 'where-it-go',
  storageBucket: 'where-it-go.firebasestorage.app',
  messagingSenderId: '343511787380',
  appId: '1:343511787380:web:aeca236c4d601ea50f6e21',
  measurementId: 'G-Z7DVJ6LJHR',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google provider with additional security settings
const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
provider.setCustomParameters({
  prompt: 'select_account',
});

export { auth, provider };
