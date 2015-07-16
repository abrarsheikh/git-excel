var Biff = require("../biff");

// Request
var request = require("superagent");
var Github = require("github-api");

var LoginActions = Biff.createActions({
  loginRepoChanged: function (data) {
    this.dispatch({
      actionType: "LOGIN_INPUT_CHANGED",
      type: "repo",
      data: data
    });
  }
});

module.exports = LoginActions;
