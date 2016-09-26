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
  
  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    console.log(message);
    var $message = $('<div>', {'class': 'chat'});
    $message.text(message.updatedAt + ' ' + message.text);
    $('#chats').append($message);
  },

  renderRoom: function(roomname) {
    app.send({
      username: null,
      text: null,
      roomname: roomname
    });
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
    console.log($('.roomselector'));
    var url = 'https://api.parse.com/1/classes/messages';
    app.fetch(url, function(data) {
      var roomNameArray = data.results.map(function(msgObj) {
        return msgObj.roomname;
      });
      var uniqRoomNames = _.uniq(roomNameArray);
      console.log(uniqRoomNames);
      $('.roomselector').empty();

      uniqRoomNames.forEach(function(room) {
        var $room = $('<option>', {'class': 'room'});
        $room.text(room);
        $('.roomselector').append($room);
      });
    });
  },

  switchRooms: function(roomName) {
    app.clearMessages();
    app.renderAllMessages(roomName);
  }

};

app.getRooms();
app.switchRooms('lobby');
// app.renderRoom('cool_hangout_spot');
app.getRooms();
