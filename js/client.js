const express = require('express');
var url = require("url");
var request = require("sync-request");
var __ = require('underscore');
var qs = require("qs");
const app = express();
const port = 3000;

var client = {
  client_id: "oauth-client-1",
  client_secret: "oauth-client-secret-1",
  redirect_uri: "http://localhost:9000/callback"
};

var authServer = {
  authorizationEndpoint: 'http://localhost:9001/authorize',
  tokenEndpoint: 'http://localhost:9001/token'
};

var buildUrl = function(base, options, hash) {
  let newUrl = url.parse(base, true);
  delete newUrl.search;
  if (!newUrl.query) {
    newUrl.query = {};
  }
  __.each(options, function(value, key, list) {
    newUrl.query[key] = value;
  });

  return url.format(newUrl);
}

var authorizeUrl = buildUrl(authServer.authorizationEndpoint, {
  response_type: 'code',
  client_id: client.client_id,
  redirect_uri: client.redirect_uri
});

// route
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/authorize', (req, res) => {
  res.redirect(authorizeUrl);
});

app.get('/callback', (req, res) => {
  let code = req.query.code;
  let form_data = qs.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_url: client.redirect_uri
  });
  var tokeRes = request('POST', authServer.tokenEndpoint, {
    body: form_data
  });
  res.send({"access_token": JSON.parse(tokeRes.getBody()).access_token })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
