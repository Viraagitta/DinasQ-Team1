const httpServer = require('./bin/http');
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
    // all socket listener here
    socket.on('connect', (data) => {
      console.log(data);
      io.emit('update-list-letter', true);
    });
    socket.on('typing-start', (data) => {
      io.emit('typing-start', data);
    });
  });

module.exports = io;