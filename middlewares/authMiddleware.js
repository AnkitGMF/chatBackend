const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authMiddleware = async (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({success:false, message: 'User not found' });
    }

    req.user = user;
    delete req.user.password;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({success:false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
