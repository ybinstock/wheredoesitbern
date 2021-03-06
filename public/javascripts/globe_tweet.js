var globeTweet = {};
globeTweet.map = {};

globeTweet.renderMap = function() {
  // render map
  L.mapbox.accessToken = 'pk.eyJ1IjoieWJpbnN0b2NrIiwiYSI6InhNejJyTGMifQ.nwKk32P-nORfMexmd3-N8Q';
  globeTweet.map = L.mapbox.map('map', 'ybinstock.k1nk0dji', {
    center: [43, -95],
    zoom: 1,
    minZoom: 3
  });
};

globeTweet.startStream = function() {
  // set variables
  var socket      = io(),
      tweetDiv    = $('#tweetd'),
      count       = 0,
      geocoder    = L.mapbox.geocoder('mapbox.places-v1'),
      counter     = $('#counter'),
      loadMessage = $('#load-msg'),
      tweetCount  = $('#tweet-count'),
      waitMessage = $('#wait-msg');
  //console.log ("vars set");

  if (count === 0) {
    $('#wait-msg').addClass('show-wait-msg');
    waitMessage.addClass('show-wait-msg');
    //  waitMessage.fadeIn();
  }

  //console.log("set timeout");
  socket.on('receive_tweet', function(tweet) {
    //console.log ("calling socket on event");
    // function to show markers on map
    var showMarker = function(lng, lat) {
      L.mapbox.featureLayer({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            lng,
            lat
          ]
        },
        properties: {
          description: '@' + tweet.user.screen_name + ': ' + tweet.text,
          'marker-size': 'small',
          'marker-color': '#FC4607',
          //'marker-symbol': 'marker'
        }
      }).addTo(globeTweet.map);
    };

    //console.log('receiving tweet');
    if (tweet.user.location) {
      tweetDiv.prepend($('<div class="clr"><img src="'
                         + tweet.user.profile_image_url + '" > <strong>@'
                         + tweet.user.screen_name + ':</strong> <a href="http://twitter.com/'
                         + tweet.user.screen_name + '/status/'
                         + tweet.id_str + '" target="blank">'
                         + tweet.text + '</a></div>').fadeIn('slow', 'swing'));
    }
    count += 1;
    counter.html(count);

    if (count > 0) {
      loadMessage.hide();
      waitMessage.removeClass('show-wait-msg');
    }

    if (tweet.geo) {
      showMarker(tweet.geo.coordinates[1], tweet.geo.coordinates[0]);
    }

    else if (tweet.user.location) {
      geocoder.query(tweet.user.location, function(err, result) {
        if (err) {
          console.log(err);
        }
        else {
          showMarker(result.latlng[1], result.latlng[0]);
        }
      });
    }

  });
};



