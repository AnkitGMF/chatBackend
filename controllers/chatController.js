const {ChatMessage} = require('../models/ChatMessage');
const User = require('../models/User');

const userExists = async (req,res) => {
    const {username} = req.body;
    const user = await User.findOne({ username });
    if(!user){
        return res.status(400).json({ exists:false, message: 'User does not exist' });
    }

    return res.status(200).json({ exists:true, message: 'User exists' });
}


const message = async (req, res) => {
    const {chatRoomId,skip} = req.body;
    if(!chatRoomId) {
        return res.status(400).json({ message: 'Chat room id is required' });
    }

    try{
        const messages = await ChatMessage.find({ chatRoomId }).sort({createdAt:1});
        res.status(200).json({ messages });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { message, userExists};