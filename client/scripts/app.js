// Create a username var
var name;

// Create a message object, containing username, text, and roomname keys
var message = {};
//message.roomname = '';

var friends = {};

// Retrieve data from Parse API
var retrieve = function(){

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for(var message in data.results){
        if (data.results[message].text !== undefined){
          var escapeText = data.results[message].text.replace(/[&<>"'` !@$%()=+{}\[\]]/g, '\\');
        }
        if (data.results[message].username !== undefined){
          var escapeName = data.results[message].username.replace(/[&<>"'` !@$%()=+{}\[\]]/g, '\\');
        }
        var $div = $('<div>'+ escapeText + ' by ' + escapeName + '</div>').addClass('main');
        $('#main').append($div);
      }
      console.log('chatterbox: Message retrieved');
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message');
    }
  });

};

// Send data to Parse API
var send = function(message){

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });

};

$(document).ready(function(event){

  name = prompt( "What is your name?" );
  $('#title').text(name + "\'s Chatterbox");

  message.username = name;
  retrieve();

  $('.chat').on('click', function(){
    message.text = $('input').val(); // return value of text
    $('input').val('');
    $('.main').html('');
    send(message);
    retrieve();
  });

  $('.users').on('click', function(){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        $('.main').remove();
        var names = {}
        for(var message in data.results){
          names[data.results[message].username] = data.results[message].username
        }
        for (var name in names){
          var $div = $('<div>'+ name + '</div>').addClass('main').attr('id', name).addClass('user');
          $('#main').append($div);
        }
        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });

  $('.room').on('click', function(){

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        $('.main').remove();
        var rooms = {}
        for(var message in data.results){
          if (data.results[message].roomname !== '' && data.results[message].roomname !== undefined){
            rooms[data.results[message].roomname] = data.results[message].roomname;
          }
        }
        for (var room in rooms){
          var $div = $('<div>' + room + '</div>').addClass('main').attr('id', room).addClass('rooms');
          $('#main').append($div);
        }
        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });



  $('#main').on('click', '.rooms', function(){

    var room = $(this).attr('id');
    message.roomname = room;
    var roomTitle = $("<p>Welcome to " + room + "!</p>").addClass('main');
    $('.main').remove();
    $('h1').append(roomTitle);
    // console.log(room);
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        var messages = {};
        for(var message in data.results){
          if (data.results[message].roomname === room){
            messages[data.results[message].text] = data.results[message].text;
          }
        }
        for (var message in messages){
          var $div = $('<div>' + message + '</div>').addClass('main').attr('id', room);
          $('#main').append($div);
        }
        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });

  $('#main').on('click', '.user', function(){
    var user = $(this).attr('id');
    friends[user] = user;
    $(this).css('background-color','red');
    console.log(friends);
  });

  $('.friends').on('click', function(){
    $('.main').remove();
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        for(var message in data.results){
          if (friends.hasOwnProperty(data.results[message].username)){
            if (data.results[message].text !== undefined){
              var escapeText = data.results[message].text.replace(/[&<>"'` !@$%()=+{}\[\]]/g, '\\');
            }
            if (data.results[message].username !== undefined){
              var escapeName = data.results[message].username.replace(/[&<>"'` !@$%()=+{}\[\]]/g, '\\');
            }
            var $div = $('<div>'+ escapeText + ' by ' + escapeName + '</div>').addClass('main');
            $('#main').append($div);
          }
        }
        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });

  // $('.build').on('click',function(){
  //   $('.main').remove();
  //   var input = $("<input>").attr("placeholder", "name your room").addClass('main').addClass('send');
  //   $('nav').append(input);

  //   $('nav').on('click', '.send', function(){
  //      var newRoom = $('.send').val();
  //      message.roomname = newRoom;
  //      send(message);
  //      $('.send').val('');
  //   });
  // });
});



//<script> $('body').css('background-color', 'red') </script>

  // var roomCreator = $("<input>").attr('placeholder', 'name your room');
  // console.log(roomCreator);
  // $('#main').append(roomCreator);


