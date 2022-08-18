const io = require('socket.io-client');
const server = require('../App');

describe('Suite of unit tests', function () {
    server.attach(3010);
    let socket;
  
    beforeAll(function (done) {
      // Setup
      socket = io.connect('http://localhost:3010', {
        'reconnection delay': 0
        , 'reopen delay': 0
        , 'force new connection': true
      });
  
      socket.on('connect', function () {
        console.log('worked...');
        done();
      });
      socket.on('disconnect', function () {
        console.log('disconnected...');
      });
    });
  
    afterAll(function (done) {
      // Cleanup
      socket.close();
      done();
    });
  
    describe('Create Official Letter Tests', function () {
      test('Create New Official Letter - Success Test', (done) => {
        const data = {
            UserId: 1,
            activityName: 'Testing new project',
            from: 'Jakarta',
            to: 'Bandung',
            leaveDate: '04/12/2022',
            returnDate: '05/12/2022',
        };
  
        socket.emit('update-list-letter', data);
  
        socket.on('chat', dataRes => {
            console.log(dataRes)
        //   expect(dataRes).toBeInstanceOf(Object);
        //   expect(dataRes).toHaveProperty('name');
          done();
        });
      });
  
    });
  
  });