// Patch require
require("node-jsx").install({ extension: ".jsx" });

// Server
var path = require("path");
var express = require("express");
var compress = require("compression");
var cookieparser = require('cookie-parser');
var methodoverride = require('method-override');
var session = require('express-session');
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var Duplex = require('stream').Duplex;
var browserChannel = require('browserchannel').server;
var livedb = require('livedb');
var sharejs = require('share');
var shareCodeMirror = require('share-codemirror');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var app = express();
var PORT = process.env.PORT || 3000;

var GITHUB_CLIENT_ID = "2b0399579308313edb04"
var GITHUB_CLIENT_SECRET = "d71cad23bdb8a2b7c7cfd1708f868fdab66e21cc";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: ['user', 'public_repo', 'repo', 'gist']
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      profile.accessToken = accessToken;
      return done(null, profile);
    });
  }
));


// ----------------------------------------------------------------------------
// Setup, sharejs
// ----------------------------------------------------------------------------
var backend = livedb.client(livedb.memory());
var share = sharejs.server.createClient({backend: backend});

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/../js'));
app.use(express.static(shareCodeMirror.scriptsDir));
app.use(express.static(__dirname + '/../node_modules/codemirror/lib'));
app.use(express.static(__dirname + '/../node_modules/codemirror/addon'));
app.use('/mode', express.static(__dirname + '/../node_modules/codemirror/mode'));
app.use(express.static(sharejs.scriptsDir));
app.use(browserChannel(function (client) {
  var stream = new Duplex({objectMode: true});
  stream._write = function (chunk, encoding, callback) {
    if (client.state !== 'closed') {
      client.send(chunk);
    }
    callback();
  };
  stream._read = function () {
  };
  stream.headers = client.headers;
  stream.remoteAddress = stream.address;
  client.on('message', function (data) {
    stream.push(data);
  });
  stream.on('error', function (msg) {
    client.stop();
  });
  client.on('close', function (reason) {
    stream.emit('close');
    stream.emit('end');
    stream.end();
  });
  return share.listen(stream);
}));
app.use(cookieparser());
app.use(methodoverride());
app.use(session({ secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------------------------------------------
// Setup, Static Routes
// ----------------------------------------------------------------------------
app.use(compress());
app.use(bodyParser());
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "../templates"));

// ----------------------------------------------------------------------------
// Static Routes
// ----------------------------------------------------------------------------
app.use("/app/js-dist/*.map", function (req, res) {
  res.send(404, "404"); // Prevent sourcemap serving.
});
app.use("/app/js-dist", express.static("app/js-dist"));
app.use("/app/css-dist", express.static("app/css-dist"));

// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------
// TODO: Example wrapper.
// var _errOrData = function (res, dataOverride) {
//   return function (err, data) {
//     if (err) {
//       return res.status(500).json({ error: err.message || err.toString() });
//     }

//     res.json(dataOverride || data);
//   };
// };

// TODO: Old REST route using wrapper.
// app["delete"]("/api/notes/:id", function (req, res) {
//   db.run("delete from notes where id=?", req.params.id, _errOrData(res, {}));
// });

// ----------------------------------------------------------------------------
// Dynamic Routes
// ----------------------------------------------------------------------------
app.get("/", ensureAuthenticated, function (req, res) {
  return res.render("index", {user: req.user});
});

app.get('/login', function(req, res) {
  res.render('login');
});



// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.cookie('github_token', req.user.accessToken, { maxAge: 900000 });
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// ----------------------------------------------------------------------------
// Start
// ----------------------------------------------------------------------------
var start = function (opts, callback) {
  callback = callback || function () {};
  opts = opts || {};
  opts.port = opts.port || PORT;
  app.listen(opts.port, callback);
};

module.exports = {
  start: start
};

// Script. Use defaults (init dev. database).
if (require.main === module) {
  start();
}
