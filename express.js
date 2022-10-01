var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require('fs');


//global variable for tweet data
var tweetinfo = [];

//global variable to store searched tweets
var searched_tweets = [];

//load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err,data ){
  if(err){
    req.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else{
    //Parse the data in the JSON file and store it in a global variable
    tweetinfo = JSON.parse(data);
  }
});
 


//Get functions
//Shows user info
app.get('/tweets', function(req, res) {
  //Get specifically the user info
  var userinfo = []

  tweetinfo.forEach(function(tweet) {
    userinfo.push({
      id: tweet.user.id,
      screen_name: tweet.user.screen_name,
      name: tweet.user.name
    });
  });

  //Send the userinfo to the client
  res.send({ userinfo: userinfo });
});

//Shows tweet info
app.get('/tweetinfo', function(req, res) {
  //Get the specific tweet info the client needs
  var tweets = []

  tweetinfo.forEach(function(tweet) {
    tweets.push({
      id: tweet.id_str,
      text: tweet.text,
      time: tweet.created_at
    });
  });

  //Send the tweetinfo to the client
  res.send({ tweets: tweets });
});

//Shows searched tweets
app.get('/searchinfo', function(req, res){
  //Get the specific tweet info the client needs
  var tweets = []

  searched_tweets.forEach(function(tweet) {
    tweets.push({
      id: tweet.id_str,
      text: tweet.text,
      time: tweet.created_at
    });
  });

  //Send the searched_tweets to the client
  res.send({ searched_tweets: tweets });
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function(req, res) {
  //Get the id, text, and time
  var tweet = req.body.tweet.split(';');
  var id = tweet[0];
  var text = tweet[1];
  var date = new Date(Date.now()).toString();

  //Update the tweetinfo array
  tweetinfo.push({
    id: Number(id),
    id_str: String(id),
    text: text,
    created_at: date,
    //Fill in default user information
    user: {
      id: 0,
      name: "Default",
      screen_name: "Default"
    }
  });

  res.send('Successfully added tweet');
});

//Posts searched tweets
app.post('/searchinfo', function(req, res) {
  var id = req.body.id;

  //Add the tweet with the corresponding id to the searched tweets list
  tweetinfo.forEach(function(tweet, index) {
    if (tweet.id_str === id){
      searched_tweets.push(tweetinfo[index]);
    }
  });
  res.send('Searched for tweet');
});

//Update
app.put('/tweets/:nm', function(req, res) {
  var name = req.params.nm;
  var newName = req.body.newName;

  //Loop through the tweets and update the screen name of the requested user
  tweetinfo.forEach(function(tweet, index) {
    if (tweet.user.name === name) {
      tweet.user.screen_name = newName;
    }
  });

  res.send('Successfully updated screen name')
});

//Delete 
app.delete('/tweetinfo/:tweetid', function(req, res) {
  //Delete the requested tweet
  var id = req.params.tweetid;

  var found = false;

  //Search through the tweet info and delete the tweet with the given id
  tweetinfo.forEach(function(tweet, index) {
    if(!found && tweet.id_str === id) {
      tweetinfo.splice(index, 1);
      found = true;
    }
  });  
  res.send('Successfully deleted tweet');
});


app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});