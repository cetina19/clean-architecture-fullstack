const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../..', '.env.firebase');

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Failed to load .env.firebase file:', result.error);
  throw result.error;
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveConfig(config) {
  try {
    const configRef = doc(db, "app-configurations", "defaultConfig");
    await setDoc(configRef, config);
    console.log("Configuration saved to Firestore successfully");
  } catch (error) {
    console.error("Error saving configuration to Firestore:", error);
  }
}

saveConfig(firebaseConfig).then(() => {
  console.log('Initial configuration stored successfully');
}).catch((error) => {
  console.error('Error storing initial configuration:', error);
});

module.exports = { saveConfig };
