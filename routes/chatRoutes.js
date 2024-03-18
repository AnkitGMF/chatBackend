const express = require('express');
const router = express.Router();
const {userExists, message} = require('../controllers/chatController');

router.post('/checkuserexists', userExists);
router.post('/message', message);


module.exports = router