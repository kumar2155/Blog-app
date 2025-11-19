const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next){
  const authHeader = req.header('Authorization');
  if(!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
