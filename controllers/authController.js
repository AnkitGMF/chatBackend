const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({success:false, message: 'Username already exists' });
    }

    const saltRounds = 10; // Number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({success:true, message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false, message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({success:false, message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({success:false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({success:true, token,user: {username:user.username,id:user._id,chatRooms:user.chatRooms} });
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false, message: 'Internal server error' });
  }
};


module.exports = { register, login };
