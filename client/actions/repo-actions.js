var Biff = require("../biff");

// Request
var request = require("superagent");
var Github = require("github-api");
var cookie = require('react-cookie');

// constants
var Constants = require('../constants');

var RepoActions = Biff.createActions({
  init: function (repo, path, type) {
    var self = this,
      github = null,
      gitPatterns = null,
      gitPatternsIndex,
      parsedUserAndRepo,
      repoObject,
      username,
      reponame,
      appExit=true;

    github = new Github({
      token: cookie.load('github_token'),
      auth: "oauth"
    });

    gitPatterns = [
      {
        pat: /(\w+:\/\/)(.+@)*([\w\d\.]+)(:[\d]+){0,1}\/*(.*)/i,
        rep: "$5"
      },
      {
        pat: /(.+@)*([\w\d\.]+):(.*)/i,
        rep: "$3"
      }
    ];

    for (gitPatternsIndex = 0; gitPatternsIndex < gitPatterns.length; gitPatternsIndex++) {
      if (gitPatterns[gitPatternsIndex].pat.test(repo)) {
        parsedUserAndRepo = repo.replace(gitPatterns[gitPatternsIndex].pat, gitPatterns[gitPatternsIndex].rep).split("/");
        username = parsedUserAndRepo[0];
        reponame = parsedUserAndRepo[1].replace(/\.git$/i, "");
        break;
      }
    }

    repoObject = github.getRepo(username, reponame);

    repoObject.show(function(err, repoInfo) {
      var repoInfo = repoInfo;
      if (err) {
        self.dispatch({
          actionType: "INIT_FAILED",
        });
        return;
      }
      repoObject.listBranches(function(err, branches) {
        self.dispatch({
          actionType: "INIT_SUCCESS",
          repo: repo,
          path: path,
          type: type,
          repoObject: repoObject,
          repoInfo: repoInfo,
          repoBranches: branches
        });
      });
    });
  },
  open: function (rObject, branch, path, type) {
    var self = this;
    if (type === Constants.CONTENT_TYPE_DIR) {
      rObject.contents(branch, path, function(err, contents) {
      if (err) {
        self.dispatch({
          actionType: "REPO_OPEN_DIR_ERROR",
          err: err,
        });
      } else {
        self.dispatch({
          actionType: "REPO_OPEN_DIR",
          currContents: contents,
          currPath: path
        });
      }
    });
    } else {
      rObject.read(branch, path, function(err, data) {
      if (err) {
        self.dispatch({
          actionType: "REPO_OPEN_FILE_ERROR",
          err: err,
        });
      } else {
        self.dispatch({
          actionType: "REPO_OPEN_FILE",
          currContents: data,
          currPath: path
        });
      }
    });
    }
  },
  updateFile: function (data) {
    this.dispatch({
      actionType: "REPO_FILE_UPDATED",
      currContents: data
    });
  },
  initRedis: function(repo) {
    var self = this;
    request
      .post('/api/init')
      .send({ 
        repo: repo,
      })
      .set('Accept', 'application/json')
      .end(function(err, res){
        alert('files have been reset');
        self.dispatch({
          actionType: "REDIS_INIT",
          appExit: false
        });
      }
    );
  },
  getDiffClicked: function(repo) {
    var self = this;
    request
      .get('/api/getDiff')
      .query({ repo: repo})
      .set('Accept', 'application/json')
      .end(function(err, res){
        var diff = (res.body.body);
        self.dispatch({
          actionType: "CODE_DIFF_UPDATED",
          codeDiff: diff
        });
      }
    );
  },
  email: function(repo, to) {
    request
      .get('/api/email')
      .query({ repo: repo, to: to})
      .set('Accept', 'application/json')
      .end(function(err, res){
        alert('Email Sent');
      }
    );
  }
});

module.exports = RepoActions;
