// YOUR CODE HERE:
var app = {
  init: function() {},
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
  
  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    // console.log(message);
    var $message = $('<div>', {'class': 'chat'});
    var $friendlink = $('<a>', {'onclick': 'console.log(1)'} );
    //var $userNameButton = $('<button>', )
    $message.append($friendlink);
    $message.text(message.username + message.text);
    $('#chats').append('<div class="chat"><a class="friendbutton" onclick="console.log(1)">' + message.username + ': </a> ' + message.text + '</div>');
  },

  renderRoom: function(roomname) {
    var $room = $('<option>', {'class': 'room', 'value': roomname});
    $room.text(roomname);
    $('#roomSelect').append($room);
  },

  renderAllMessages: function(roomName) {
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
  }

};

app.getRooms();
app.switchRooms('lobby');
// app.renderRoom('tornadoShelter');
//app.getRooms();
