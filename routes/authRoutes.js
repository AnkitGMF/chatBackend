const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const {message} = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/verifytoken', authMiddleware, (req, res) => {
  res.status(200).json({success:true, message: 'Token is valid'});
});
router.get('/user',authMiddleware, (req,res) => {
  res.status(200).json({success:true, message: 'User found', user: {username:req.user.username,id:req.user._id,chatRooms:req.user.chatRooms}});
});
router.get('/messages',authMiddleware,message);

module.exports = router;
