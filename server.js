const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('node:http');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes')
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
const { ChatMessage } = require('./models/ChatMessage');


dotenv.config();

const scoketConnections = {};

const app = express();
app.use(express.static('node_modules/chatapp-frontend-angular/dist/client/browser'))

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const server = createServer(app);
const io = new Server(server);

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('loggedIn',(data)=>{
    scoketConnections[data.username] = socket;
    const {chatRooms} = data;
    chatRooms.forEach((chatRoom)=>{
      socket.join(chatRoom.chatRoomId);
    })
  })

  socket.on('createChatRoom', (data) => {
    const {name, users} = data;
    const chatRoomId = uuidv4();
    users.forEach(async(user) => {
      await User.findOneAndUpdate({username: user}, {$push: {chatRooms: {chatRoomId,name}}})
      const socketId = scoketConnections[user];
      if(socketId){
        socketId.join(chatRoomId);
        socketId.emit('chatRoomCreated', {name, chatRoomId});
      }
    });
  });

  socket.on('send message', (data) => {
    const chatMessage = new ChatMessage(data);
    chatMessage.save();
    io.to(data.chatRoomId).emit('receive message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api',chatRoutes)

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(3000,()=>{
  console.log('Server is running on port 3000');
})
