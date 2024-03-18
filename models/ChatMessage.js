const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    chatRoomId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = {ChatMessage};
