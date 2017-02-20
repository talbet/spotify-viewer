/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');
var ENV = require('../env') // Config Variables

var client_id = ENV.CLIENT_ID;
var client_secret = ENV.CLIENT_SECRET;
var redirect_uri = ENV.REDIRECT_URI;
var stateKey = 'spotify_auth_state';
var scope = 'user-read-private user-read-email';

var spotifyWebApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
})

/* Express Setup */

var app = express();

// Add cookieParser middleware
app.use(cookieParser());

app.get('/login', function (req, res) {

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

/* Handle authorization callback from Spotify */
app.get('/callback', function (req, res) {

  /* Read query parameters */
  var code = req.query.code; // Read the authorization code from the query parameters
  var state = req.query.state; // (Optional) Read the state from the query parameter

  /* Get the access token! */
  spotifyWebApi.authorizationCodeGrant(code).then(function (data) {

    /* Set token in cookie */
    var access_token = data.body.access_token || '';
    var refresh_token = data.body.refresh_token || '';

    res.clearCookie('access_token');
    res.cookie('access_token', access_token, { maxAge: 2592000000 });
    res.clearCookie('refresh_token');
    res.cookie('refresh_token', refresh_token, { maxAge: 3153600000 });

    /* Redirecting back to the main page */
    res.redirect('/');

  }, function (err) {
    res.status(err.statusCode);
    res.send(err.message);
  });
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.cookies.refresh_token || '';
  spotifyWebApi.setRefreshToken(refresh_token);
  spotifyWebApi.refreshAccessToken().then(function (data) {
    /* Set token in cookie */
    var access_token = data.body.access_token || '';

    res.clearCookie('access_token');
    res.cookie('access_token', access_token, { maxAge: 2592000000 });

    res.json(data.body)
  }, function (err) {
    res.status(err.statusCode);
    res.send(err.message);
  });

});

console.log('Auth Server Loaded');
module.exports = app;
