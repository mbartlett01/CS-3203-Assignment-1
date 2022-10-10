
$(function() {
   $('#get-button').on('click', function() {
      //Get and display the user information of the tweets
      $.ajax({
        url: '/tweets',
        contentType: 'application/json',
        success: function(response){
          //Create the table rows displaying the user information
          var tbodyEl = $('#namebody');

          tbodyEl.html('');

          response.userinfo.forEach(function(user) {
            tbodyEl.append('\
              <tr>\
                <td class="id">' + user.id + '</td>\
                <td><input type="text" class="screen_name"\
                 value=' + user.screen_name + '></td>\
                <td><input type="text" class="name"\
                 value="' + user.name + '""></td>\
              </tr>\
              ');
          });
        }
      });
    });


    //Get tweets
    $('#get-tweets-button').on('click', function(){
      //Get and display the tweet information of the tweets
      $.ajax({
        url: '/tweetinfo',
        contentType: 'application/json',
        success: function(response){
          //Create the table rows displaying the tweet information
          var tbodyEl = $('#tweetbody');

          tbodyEl.html('');

          response.tweets.forEach(function(tweet) {
            tbodyEl.append('\
              <tr>\
                <td class="id">' + tweet.id + '</td>\
                <td><input type="text" class="screen_name"\
                 value="' + tweet.text + '""></td>\
                <td><input type="text" class="name"\
                 value="' + tweet.time + '""></td>\
              </tr>\
              ');
          });
        }
      });
    });

    //Get searched tweets
    $('#get-searched-tweets').on('click', function() {
      //Get and display the tweet information of the tweets
      $.ajax({
        url: '/searchinfo',
        contentType: 'application/json',
        success: function(response){
          //Create the table rows displaying the tweet information
          var tbodyEl = $('#searchbody');

          tbodyEl.html('');

          response.searched_tweets.forEach(function(tweet) {
            tbodyEl.append('\
              <tr>\
                <td class="id">' + tweet.id + '</td>\
                <td><input type="text" class="screen_name"\
                 value="' + tweet.text + '""></td>\
                <td><input type="text" class="name"\
                 value="' + tweet.time + '""></td>\
              </tr>\
              ');
          });
        }
      });
    });


  //CREATE
  $('#create-form').on('submit', function(event){
        event.preventDefault();

        var createInput = $('#create-input');

        //Send the tweet info to the server
        $.ajax({
          url: '/tweetinfo',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ tweet: createInput.val() }),
          success: function(response) {
            createInput.val('');
            //Refresh the tweet list
            $('#get-tweets-button').click();
          }
        });
  });

    //Create searched tweets
  $('#search-form').on('submit', function(event){
    event.preventDefault();
    var userID = $('#search-input');
    
    //Send the search info to the server
    $.ajax({
      url: '/searchinfo',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ id: userID.val() }),
      success: function(response) {
        userID.val('');
        //Display the searched for tweets
        $('#get-searched-tweets').click();
      }
    });

  });

  //UPDATE/PUT
  $("#update-user").on('submit', function(event){
      event.preventDefault();
    var updateInput = $('#update-input');
    var inputString = updateInput.val();

    const parsedStrings = inputString.split(';');

    var name = parsedStrings[0];
    var newName = parsedStrings[1];
    
    //Update the screen name of a user
    $.ajax({
      url: '/tweets/' + name,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ newName: newName }),
      success: function(response) {
        console.log(response);
        //Update the user table
        $('#get-button').click();
      }
    });
  });


  //DELETE
  $("#delete-form").on('submit', function() {
    var id = $('#delete-input');
    event.preventDefault();

    //Send the id of the tweet we want deleted
    $.ajax({
      url: '/tweetinfo/' + String(id[0].value),
      method: 'DELETE',
      contentType: 'application/json',
      success: function(response) {
        //Refresh the tweet list
        $('#get-tweets-button').click();
      }
    });
  });


});

function test_print(){

  console.log("test code")

}
                    
   