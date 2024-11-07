const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../..', '.env.firebase');

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Failed to load .env.firebase file:', result.error);
  throw result.error;
}

const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_JSON_ROUTE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});


module.exports = admin;
