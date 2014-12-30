// Create a username var
var name;

// Create a message object, containing username, text, and roomname keys
var message = {};

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

// Refresh diplayed messages every 3 seconds
  // setInterval(function(){
  //   $('.main').html('');
  //   retrieve();
  // },3000);

  $('.chat').on('click', function(){
    message.text = $('input').val(); // return value of text
    $('input').val('');
    $('.main').html('');
    message.roomname = '';
    send(message);
    retrieve();
  });

  $('.users').on('click', function(){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        $('.main').remove();
        var names = {}
        for(var message in data.results){
          names[data.results[message].username] = data.results[message].username
        }
        for (var name in names){
          var $div = $('<div>'+ '"' + name + '"' + '</div>').addClass('main').addClass(name);
          $('#main').append($div);
        }
        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });

  $('h1').on('click', 'div', function(){

  })

});




//<script> $('body').css('background-color', 'red') </script>




