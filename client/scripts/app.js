// YOUR CODE HERE:
var app = {
  currentRoom: null,
  friendsObj: {},
  latestTimestamp: 0,
  newMsgCounter: 0,

  init: function() {
    app.getRooms();
    app.switchRooms('Create New Room');

    setInterval(function() {
      app.checkForNewMessages();
      app.renderNewMsgBanner();
      //app.getRooms(); 
    }, 3000);
  },
  
  send: function(message, cb) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        //app.renderAllMessages(app.currentRoom);
        cb();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    }); },
  
  fetch: function(params, cb) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: params,
      contentType: 'application/json',
      success: function (data) {
        cb(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to get data');
      }
    }); },
  
  sendMessage: function(username, roomname, text, cb) {
    app.send({
      username: username,
      text: text,
      roomname: roomname
    }, cb);
  },
  
  submitMessage: function() {
    var roomname = app.currentRoom;
    var txt = $('.input').val();
    var user = (window.location.search).split('=')[1];
    if (roomname !== 'Create New Room') {
      app.sendMessage(user, roomname, txt, function() {
        app.renderAllMessages(app.currentRoom);
      });
      
    } else {
      var newRoomName = window.prompt('Enter a new room name, adventurer!');
      if (newRoomName) {
        app.currentRoom = newRoomName;
        app.sendMessage(user, newRoomName, txt, function() {
          app.getRooms();
        });
      }
    }
  },

  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    var text = message.text;
    var username = message.username;

    text = text.replace(/\</g, '\\<').replace(/\>/g, '\\>');

    var $chat = $('<div class="chat"><a class="username" onclick="app.handleUsernameClick(\'' + username + '\');">' 
      + username + ' </a> ' 
      + text + '</div>');

    if (app.friendsObj[username]) {
      $chat.attr('class', 'friend');
    }
    $('#chats').append($chat);
  },

  renderRoom: function(roomname) {
    var $room = $('<option>', {'class': 'room', 'value': roomname});
    $room.text(roomname);
    $('#roomSelect').append($room);
    // $('.roomselector').val(roomname);
    // app.switchRooms(roomname);
  },

  renderAllMessages: function(roomName) {
    roomName = roomName || app.currentRoom;
    app.clearMessages();
    // var getAllMsgsUrl = 'https://api.parse.com/1/classes/messages?order=-updatedAt';
    
    app.fetch({order: '-updatedAt', where: {roomname: {$in: [roomName]}}}, function(data) {
      app.latestTimestamp = data.results[0].updatedAt;
      data.results.forEach(function(message) {
        // if (message.roomname === roomName) {
          app.renderMessage(message);
        // }
      });
    });
    app.newMsgCounter = 0;
    $('#banner').empty();
    $('title').text('chatterbox');
  },

  getRooms: function() {
    // console.log($('.roomselector'));
    // var url = 'https://api.parse.com/1/classes/messages?order=-updatedAt';
    app.fetch({order: '-updatedAt'}, function(data) {
      var roomNameArray = data.results.map(function(msgObj) {
        return msgObj.roomname;
      });
      var uniqRoomNames = _.uniq(roomNameArray);
      // console.log(uniqRoomNames);
      $('#roomSelect').empty();
      $('#roomSelect').append('<option>Create New Room</option>');
      uniqRoomNames.forEach(function(room) {
        app.renderRoom(room);
      });
      app.switchRooms(app.currentRoom);
    });
  },

  switchRooms: function(roomName) {
    console.log(roomName);
    app.clearMessages();
    app.renderAllMessages(roomName);
    app.currentRoom = roomName;
  },

  handleUsernameClick: function(friend) {
    console.log('adding: ' + friend);
    if (!app.friendsObj[friend]) { 
      app.friendsObj[friend] = true;
    }

    app.renderAllMessages();
  },

  checkForNewMessages: function() {
    var context = this;
    app.fetch({where: {updatedAt: {$gt: {__type: 'Date', iso: '' + app.latestTimestamp + ''}}}}, function(data) {
      console.log(data);
      var newMsgsInRoom = data.results.filter(function(msg) {
        console.log(msg.roomname, app.currentRoom, app.newMsgCounter);
        if (msg.roomname === app.currentRoom) {
          return true;
        }
      });
      app.newMsgCounter = newMsgsInRoom.length;
    });
    console.log('new msgs: ' + app.newMsgCounter);
  },

  renderNewMsgBanner: function() {
    if (app.newMsgCounter > 0) {
      $('#banner').empty();
      var $banner = $('<div>', {'class': 'banner', 'onclick': 'app.renderAllMessages("' + app.currentRoom + '")'});
      $banner.text(app.newMsgCounter + ' New Messages!');
      $('#banner').append($banner);
      $('title').text('chatterbox (' + app.newMsgCounter + ')');
    }
  }

};

app.init();
