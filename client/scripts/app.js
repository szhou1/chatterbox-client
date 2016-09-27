// YOUR CODE HERE:
var app = {
  currentRoom: null,
  friendsObj: {},

  init: function() {
    app.getRooms();
    app.switchRooms("Select Room");
  },
  
  send: function(message) {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    }); },
  
  fetch: function(url, cb) {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: url,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        cb(data);

      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get data');
      }
    }); },
  
  sendMessage: function(username, roomname, text) {
    app.send({
      username: username,
      text: text,
      roomname: roomname
    });
  },
  
  submitMessage: function() {
    var roomname = app.currentRoom;
    var txt = $('.input').val();
    var user = (window.location.search).split('=')[1];
    if(roomname !== 'Select Room'){
      app.sendMessage(user, roomname, txt);
      app.renderAllMessages(roomname);
    } else {
      alert('Please first select a room!');
    }
  },

  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    var text = encodeURI(message.text);
    var username = encodeURI(message.username);
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
  },

  renderAllMessages: function(roomName) {
    roomName = roomName || app.currentRoom;
    app.clearMessages();
    var getAllMsgsUrl = 'https://api.parse.com/1/classes/messages?order=-updatedAt';
    app.fetch(getAllMsgsUrl, function(data) {
      data.results.forEach(function(message) {
        if (message.roomname === roomName) {
          app.renderMessage(message);
        }
      });
    });
  },

  getRooms: function() {
    // console.log($('.roomselector'));
    var url = 'https://api.parse.com/1/classes/messages?order=-updatedAt';
    app.fetch(url, function(data) {
      var roomNameArray = data.results.map(function(msgObj) {
        return msgObj.roomname;
      });
      var uniqRoomNames = _.uniq(roomNameArray);
      // console.log(uniqRoomNames);
      $('#roomSelect').empty();
      $('#roomSelect').append('<option>Select Room</option>');
      uniqRoomNames.forEach(function(room) {
        app.renderRoom(room);
      });
    });
  },

  switchRooms: function(roomName) {
    console.log(roomName);
    app.clearMessages();
    app.renderAllMessages(roomName);
    app.currentRoom = roomName;
  },

  handleUsernameClick: function(friend) {
    console.log("adding: " + friend);
    if (!app.friendsObj[friend]) { 
      app.friendsObj[friend] = true;
    }

    app.renderAllMessages();
  },

};



app.init();
