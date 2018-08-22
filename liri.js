require("dotenv").config();

// Requires:
var fs = require("fs");
var chalk = require("chalk");
var moment = require("moment");
var request = require("request");
var dotenv = require("dotenv");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");

// Terminal input variables
var action = process.argv[2];
var input = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
  input += (" " + process.argv[i]);
};

// CONCERT-THIS
if (action === "concert-this") {
  var artist = input.trim();
  // Bandsintown API Key
  var bandKey = keys.bandKey.apikey

  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bandKey;
  request(queryURL, function (error, response, body) {
    if (error) {
      console.log(chalk.red(error));
      return
    }
    if (!error && response.statusCode === 200) {
      if (body.length < 10) {
        console.log(chalk.red("-------------------------------"));
        console.log(chalk.red("No upcoming events in system :("));
        console.log(chalk.red("-------------------------------"));
        return
      };
      var data = JSON.parse(body);
      for (var i = 0; i < 5; i++) {
        console.log(chalk.magenta("----------------------------------------"));
        console.log(chalk.cyan("Venue:     ") + chalk.green(data[i].venue.name));
        console.log(chalk.cyan("Location:  ") + chalk.green(data[i].venue.city + ", " + data[i].venue.country));
        console.log(chalk.cyan("Date:      ") + chalk.green(moment(data[i].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY')));
      };
      console.log(chalk.magenta("----------------------------------------"));
    };
  });
};

// SPOTIFY-THIS-SONG
if (action === "spotify-this-song") {
  spotify();
}
function spotify() {
  if (!input) {
    var song = "Ace of Base";
  } else {
    var song = input.trim();
  }
  spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });
  spotify
    .search({ type: 'track', query: song })
    .then(function (response) {
      var artist = response.tracks.items[0].artists[0].name;
      var title = (response.tracks.items[0].name);
      var album = response.tracks.items[0].album.name;
      var preview = response.tracks.items[0].preview_url;
      console.log(chalk.magenta("----------------------------------------"));
      console.log(chalk.cyan("Artist:") + " " + chalk.green(artist));
      console.log(chalk.cyan("Title:") + " " + chalk.green(title));
      console.log(chalk.cyan("Album:") + " " + chalk.green(album));
      console.log(chalk.cyan("Preview:") + " " + chalk.green(preview));
      console.log(chalk.magenta("----------------------------------------"));
    })
    .catch(function (err) {
      return console.log(chalk.red(err));
    });
}

// MOVIE-THIS
if (action === "movie-this") {
  if (!input) {
    var movie = "Mr.Nobody";
  } else {
    var movie = input.trim();
  };
  var omdbKey = keys.omdb.apikey;
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdbKey;
  request(queryURL, function (error, response, body) {
    if (error) {
      console.log(chalk.red(error));
      return
    }
    if (!error && response.statusCode === 200) {

      var movieInfo = (JSON.parse(body));
      var title = (movieInfo.Title);
      var year = (movieInfo.Year);
      var imdbRating = (movieInfo.imdbRating);
      var rtRating = (movieInfo.Ratings[1].Value);
      var country = (movieInfo.Country);
      var language = (movieInfo.Language);
      var plot = (movieInfo.Plot);
      var actors = (movieInfo.Actors);
      console.log(chalk.magenta("----------------------------------------"));
      console.log(chalk.cyan("Title:") + " " + chalk.green(title));
      console.log(chalk.cyan("Year:") + " " + chalk.green(year));
      console.log(chalk.cyan("IMDB Rating:") + " " + chalk.green(imdbRating));
      console.log(chalk.cyan("Rotten Tomatoes Rating:") + " " + chalk.green(rtRating));
      console.log(chalk.cyan("Produced in:") + " " + chalk.green(country));
      console.log(chalk.cyan("Language:") + " " + chalk.green(language));
      console.log(chalk.cyan("Plot:") + " " + chalk.green(plot));
      console.log(chalk.cyan("Actors:") + " " + chalk.green(actors));
      console.log(chalk.magenta("----------------------------------------"));
    };
  });
};

// DO-WHAT-IT-SAYS
if (action === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(chalk.red(err));
    } else {
      var randomArr = data.split(",");
      var action = randomArr[0];
      var input = randomArr[1];

      if (action === "spotify-this-song") {
        var song = input.trim();

        spotify = new Spotify({
          id: keys.spotify.id,
          secret: keys.spotify.secret
        });
        spotify
          .search({ type: 'track', query: song })
          .then(function (response) {
            var artist = response.tracks.items[0].artists[0].name;
            var title = (response.tracks.items[0].name);
            var album = response.tracks.items[0].album.name;
            var preview = response.tracks.items[0].preview_url;
            console.log(chalk.magenta("----------------------------------------"));
            console.log(chalk.cyan("Artist:") + " " + chalk.green(artist));
            console.log(chalk.cyan("Title:") + " " + chalk.green(title));
            console.log(chalk.cyan("Album:") + " " + chalk.green(album));
            console.log(chalk.cyan("Preview:") + " " + chalk.green(preview));
            console.log(chalk.magenta("----------------------------------------"));
          })
          .catch(function (err) {
            return console.log(chalk.red(err));
          })
      }
    }
  })
};




