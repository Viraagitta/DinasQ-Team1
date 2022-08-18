const httpServer = require('./bin/http');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
  // all socket listener here
  socket.on('chat', (data) => {
    console.log(data);
    io.emit('update-list-letter', true);
  });
});

module.exports = io;