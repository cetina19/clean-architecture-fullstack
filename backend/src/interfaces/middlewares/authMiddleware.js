const admin = require("../../config/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
    req.user = decodedToken;
    next();
  } catch (error) { 
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = verifyToken;
