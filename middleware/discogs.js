var express = require('express'); // Express web server framework
var fetch = require('isomorphic-fetch');
var cheerio = require('cheerio');

/* Express Setup */

var app = express();

/* Handle authorization callback from Spotify */
app.get('/discogs', function (req, res) {
  var searchterm = encodeURI(req.query.search);

  fetch('https://www.discogs.com/search/?q=' + searchterm + '&type=all', { mode: 'cors' })
    .then(checkStatus)
    .then(parseText)
    .then(function (body) {
      var typeMap = {
        'm': 'masters',
        'r': 'releases',
      };

      var $ = cheerio.load(body);
      var id = $('.cards .card:first-child').data('id');
      var idType = typeMap[id[0]];
      var idNumber = id.slice(1);
      return fetch('https://api.discogs.com/' + idType + '/' + idNumber + '', { mode: 'cors' });
    })
    .then(checkStatus)
    .then(parseText)
    .then(function (body) {
      res.send(body);
    })
    .catch((err) => {
      res.status(err.statusCode);
      res.send(err.message);
    });
});

console.log('Discogs Loaded');
module.exports = app;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error
  }
}

function parseText(response) {
  return response.text()
}
