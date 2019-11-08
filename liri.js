require("dotenv").config();
var moment = require("moment")
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require('fs')




var spotify = new Spotify(keys.spotify);
var userCommand = process.argv[2]
var userSearch = process.argv.slice(3).join(' ')
parseCommand(userCommand, userSearch)
function bandsInTown(artist) {

  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (resp) {
    resp.data.forEach(event => {
      time = moment(event.datetime, "YYYY/MM/DD/HH:mm:ss").format("MM/DD/YYYY")
      outputData = (`What: ${event.venue.name}\n
      Where: ${event.venue.city}\n
      When: ${time}`)

      console.log(outputData)
      writeLog(outputData)
    });
  })
}


function spotifyThis(song) {
  if (!song) song = "The Sign Ace of Base"
  artists = []
  spotify.search({ type: 'track', query: song }).then(function (resp) {
    resp.tracks.items[0].artists.forEach(artist => artists.push(artist.name))
    outputData = (`
    Artists: ${artists}
    Song: ${resp.tracks.items[0].name}\n
    Preview: ${resp.tracks.items[0].preview_url}\n
    Album: ${resp.tracks.items[0].album.name}`);
    console.log(outputData)
    writeLog(outputData)
  })
}

function movieThis(movie) {
  if (!movie) movie = "Mr. Nobody"
  axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(function (resp) {
    outputData = (`${movie}\n
    Released: ${resp.data.Released}\n
    IMDB rating:  ${resp.data.imdbRating}\n
    ${resp.data.Ratings[1].Source}: ${resp.data.Ratings[1].Value}\n
    Made in ${resp.data.Country} using ${resp.data.Language}\n
    Plot: ${resp.data.Plot}\n
    Actors: ${resp.data.Actors}`)
    console.log(outputData)
    writeLog(outputData)
  })
}

function readRandomTextFile() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    var fileData = data.substr(0, data.length - 2).split(',')
    console.log(fileData)
    parseCommand(fileData[0], fileData[1])

  })
}

function parseCommand(command, data) {
  switch (command) {
    case 'concert-this':
      artist = data
      writeLog(command)
      bandsInTown(artist)

      break;
    case 'spotify-this-song':
      song = data
      writeLog(command)
      spotifyThis(song)
      break;
    case 'movie-this':
      movie = data
      writeLog(command)
      movieThis(movie)
      break;
    case 'do-what-it-says':
      writeLog(command)
      readRandomTextFile()
      break;

    default:
      break;
  }
}

function writeLog(log) {
  fs.appendFile('log.txt', `${log}\n`, (err) => {
    if (err) throw err;
  });

}
