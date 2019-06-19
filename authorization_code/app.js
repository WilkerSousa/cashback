var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

if(process.env.CLIENT_ID_PRD == "" || process.env.CLIENT_ID_PRD == undefined) {
  console.log("Por favor preencha a variavel de ambiente CLIENT_ID_PRD!!!");
}
if(process.env.CLIENT_SECRET_PRD == "" || process.env.CLIENT_SECRET_PRD == undefined) {
  console.log("Por favor preencha a variavel de ambiente CLIENT_SECRET_PRD!!!");
}
if(process.env.REDIRECT_URI_PRD == "" || process.env.REDIRECT_URI_PRD == undefined) {
  console.log("Por favor preencha a variavel de ambiente REDIRECT_URI_PRD!!!");
}
if(process.env.CLIENT_ID_HML == "" || process.env.CLIENT_ID_HML == undefined) {
  console.log("Por favor preencha a variavel de ambiente CLIENT_ID_HML!!!");
}
if(process.env.CLIENT_SECRET_HML == "" || process.env.CLIENT_SECRET_HML == undefined) {
  console.log("Por favor preencha a variavel de ambiente CLIENT_SECRET_HML!!!");
}
if(process.env.REDIRECT_URI_HML == "" || process.env.REDIRECT_URI_HML == undefined) {
  console.log("Por favor preencha a variavel de ambiente REDIRECT_URI_HML!!!");
}

params = {
  clientidprd: process.env.CLIENT_ID_PRD,
  clientsecretprd: process.env.CLIENT_SECRET_PRD,
  redirecturiprd: process.env.REDIRECT_URI_PRD,
  clientidhml: process.env.CLIENT_ID_HML,
  clientsecrethml: process.env.CLIENT_SECRET_HML,
  redirecturihml:process.env.REDIRECT_URI_HML
}

console.log("Variaveis de ambiente preenchidas com SUCESSO!");

if (params.clientidprd == undefined || params.clientsecretprd == undefined || params.redirecturiprd == undefined || params.clientidhml == undefined || params.clientsecrethml == undefined || params.redirecturihml == undefined){
  process.abort;
}

var client_id = params.clientidprd; //'f6b1df8cd7404e12b48da9d13c595f5e'; //'CLIENT_ID'; // Your client id
var client_secret = params.clientsecretprd; //'901d59d059674755a4d0fd2486fac37c'; //'CLIENT_SECRET'; // Your secret
var redirect_uri = params.redirecturiprd; //'http://localhost:8888/callback'; //'REDIRECT_URI'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  console.log('Chegou aqui SIM!!!');
  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        function promiseCat() {
          return new Promise((resolve, reject) => {
            var options = {
              url: 'https://api.spotify.com/v1/browse/categories?offset=0&limit=50',
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            };

            //only confirm the access_token for POSTMAN
            console.log(access_token);

            request.get(options, function(error, response, body) {
              var firstPage = body.categories.items;
              console.log('*** Consultando Categorias ***');
              console.log('As 50 primeiras categorias são:');
              firstPage.forEach(function(categories, index) {
                console.log(index + ': ' + categories.name + ' (' + categories.id + ')');
              });
              console.log('*** Totalizaram => ' + body.categories.total + ' Categorias no GERAL *** ');
              resolve(body);
            });            
          });
        } 

        function promiseFiftmusics(categoriesName) {
          // We'll list the first 50 musics of each Categorie
          return new Promise((resolve, reject) => {
            var options = {
              url: 'https://api.spotify.com/v1/browse/categories/' + categoriesName.id + '/playlists?offset=0&limit=50',
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            };
            
            //only confirm if URL is right
            //console.log(options.url);

            request.get(options, function(error, response, body) {
              var firstPage = body.playlists.items;
              console.log('*** Consultando Discos ***');
              console.log('As 50 primeiras músicas da categoria "' + categoriesName.name + '" são:');
              firstPage.forEach(function(playlists, index) {
                console.log(index + ': ' + playlists.name);
              });
              console.log('*** Totalizaram => ' + body.playlists.total + ' Músicas no GERAL *** ');
              resolve(body);
            });
          });             
        }      

        promiseCat()
            .then(retornoCategoria => retornoCategoria.categories.items.forEach(function(id) {
              promiseFiftmusics(id)
            })).catch((error) => {
              console.error(error)
            })
            .then(retornoMusicas => console.log(retornoMusicas)).catch((error) => {
              console.error(error)
            });


        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/searchArtist', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


console.log('Listening on 8888');
app.listen(8888);
