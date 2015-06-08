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
      repo,
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

    repo = github.getRepo(username, reponame);

    repo.show(function(err, repo) {
      if (err) {
        self.dispatch({
          actionType: "SIGNIN_FAILED",
        });
        return;
      }
      self.dispatch({
        actionType: "SIGNIN_SUCCESS",
        repo: repo
      });
    });
  }
});

module.exports = LoginActions;
