var Biff = require("../biff");

// Request
var request = require("superagent");
var Github = require("github-api");

var LoginActions = Biff.createActions({
  loginByToken: function (data) {
    var self = this,
      github = null,
      gitPatterns = null,
      gitPatternsIndex,
      parsedUserAndRepo,
      repoObject,
      username,
      reponame;

    github = new Github({
      token: data.token,
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
      if (gitPatterns[gitPatternsIndex].pat.test(data.repo)) {
        parsedUserAndRepo = data.repo.replace(gitPatterns[gitPatternsIndex].pat, gitPatterns[gitPatternsIndex].rep).split("/");
        username = parsedUserAndRepo[0];
        reponame = parsedUserAndRepo[1].replace(/\.git$/i, "");
        break;
      }
    }

    repoObject = github.getRepo(username, reponame);

    repoObject.show(function(err, repo) {
      var repoInfo = repo;
      if (err) {
        self.dispatch({
          actionType: "SIGNIN_FAILED",
        });
        return;
      }
      repoObject.listBranches(function(err, branches) {
        self.dispatch({
          actionType: "SIGNIN_SUCCESS",
          repoObject: repoObject,
          repoInfo: repoInfo,
          repoBranches: branches
        });
      });
    });
  },
  loginTokenChanged: function (data) {
    this.dispatch({
      actionType: "LOGIN_INPUT_CHANGED",
      type: "token",
      data: data
    });
  },
  loginRepoChanged: function (data) {
    this.dispatch({
      actionType: "LOGIN_INPUT_CHANGED",
      type: "repo",
      data: data
    });
  }
});

module.exports = LoginActions;
