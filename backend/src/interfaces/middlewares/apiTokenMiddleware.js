require('dotenv').config();
const predefinedToken = process.env.PREDEFINED_API_TOKEN
const verifyPredefinedToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    next( {name: '/signin' });
    return res.status(401).json({ message: 'No token provided.' });
  }

  if (token === `Bearer ${predefinedToken}`) {
    next();
  } else {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyPredefinedToken;
