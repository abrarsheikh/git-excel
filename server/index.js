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
var redis = require('redis');
var redisClient = redis.createClient(); //creates a new client 
require('colors')
var jsdiff = require('diff');



var app = express();
var PORT = process.env.PORT || 3000;

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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
app.use(express.static(__dirname + '/../css'));
app.use(express.static(__dirname + '/../images'));
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
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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

app.post('/api/init', function (req, res) {
  // get query parameter
  var repo = req.body.repo;

  // clear all previsous docs
  redisClient.del(req.body.repo, function(err, reply) {
      console.log("cleared all previous documents");
      if (err) {
        res.send(JSON.stringify({
          success: false,
          body: err
        }));
      } else {
        res.send(JSON.stringify({
          success: true,
          body: reply
        }));
      }
  });
});

app.get('/api/getFIles', function(req, res) {
  // add new docs to list
  redisClient.lrange(req.query.repo, 0, -1, function(err, reply) {
    res.setHeader('Content-Type', 'application/json');
    res.send(reply);
  });
})

app.post('/api/newDoc', function (req, res) {
  // get query parameter
  var repo = req.body.repo;
  var docPath = req.body.docPath;
  var doc = req.body.doc;

  // add new docs to list
  redisClient.rpush([req.body.repo, req.body.docPath], function(err, reply) {
      redisClient.lrange(req.body.repo, 0, -1, function(err, reply) {
          console.log(reply); 
      });
  });

  redisClient.set(repo+docPath+'_old', doc, function(err, reply) {
      res.setHeader('Content-Type', 'application/json');
      if (err) {
        res.send(JSON.stringify({
          success: false,
          body: err
        }));
      } else {
        res.send(JSON.stringify({
          success: true,
          body: reply
        }));
      }
  });
});

app.post('/api/updateDoc', function (req, res) {
  // get query parameter
  var repo = req.body.repo;
  var docPath = req.body.docPath;
  var doc = req.body.doc;

  redisClient.set(repo+docPath+'_new', doc, function(err, reply) {
      res.setHeader('Content-Type', 'application/json');
      if (err) {
        res.send(JSON.stringify({
          success: false,
          body: err
        }));
      } else {
        res.send(JSON.stringify({
          success: true,
          body: reply
        }));
      }
  });
});

app.get('/api/getDiff', function (req, res) {
  // get query parameter
  var repo = req.query.repo;

  redisClient.lrange(req.query.repo, 0, -1, function(err, reply) {
      var docPaths = reply,
        i,
        numOfDocs = docPaths.length,
        docDiffs = [];
      docPaths.forEach(function (docPath) {
        var oldDoc, newDoc;
        redisClient.get(repo+docPath+'_old', function(err, reply) {
          res.setHeader('Content-Type', 'application/json');
          if (err) {
            res.send(JSON.stringify({
              success: false,
              body: err
            }));
          } else {
            oldDoc = reply;
            redisClient.get(repo+docPath+'_new', function(err, reply) {
              res.setHeader('Content-Type', 'application/json');
              if (err) {
                res.send(JSON.stringify({
                  success: false,
                  body: err
                }));
              } else {
                newDoc = reply;
                var diff = jsdiff.diffLines(oldDoc, newDoc);
                docDiffs.push({
                  docDiff: diff,
                  path: docPath
                });
                if(docDiffs.length === numOfDocs) {
                  res.send({
                    success: true,
                    body: docDiffs
                  });
                }
              }
          });
          }
      });
      });
  });
});

app.get('/api/email', function(req, res) {
  res.send({
    success: true
  })
})

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
