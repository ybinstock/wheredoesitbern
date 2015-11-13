var express    = require('express'),
    app        = express(),
    server     = require('http').createServer(app),
    ejs        = require('ejs'),
    bodyParser = require('body-parser'),
    io         = require('socket.io').listen(server);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// set up tweet stream
var Twitter = require('node-tweet-stream'),
    t       = new Twitter({
      consumer_key: 'dzvYQsFmJwQi9KYDqa9jLzsS8',
      consumer_secret: 'k2nrYcvDuiFhPFBotyu9zNaYWdtpBSoVTSSkMy7UhBQ9YxWcUN',
      token: '277283214-tTI4nc2C7vS6KyNZuVYJmhfKSGKqOIfV4PeHxadF',
      token_secret: '1gTEMjFvxRIWpmHLkISrI7DQxwiwDvLm0QIFkuNjj69XV'
    });

// connect to socket
io.on('connection', function(socket) {
  //console.log('user connected');

  socket.on('disconnect', function() {
    //console.log('user disconnected');
  });
});

// stream tweets
t.on('tweet', function(tweet) {
  io.sockets.emit('receive_tweet', tweet);
});

// root route automatically tracks tweets from keyword
app.get('/', function(req, res) {

// set variable for keyword
  var searchKey = 'feelthebern';

  t.track(searchKey);
  //console.log('tracking', searchKey);

//render map
  res.render('index');
});

server.listen(process.env.PORT || 5000, function() {
  console.log('server started');
});