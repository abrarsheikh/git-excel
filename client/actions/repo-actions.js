var Biff = require("../biff");

// Request
var request = require("superagent");
var Github = require("github-api");

// constants
var Constants = require('../constants');

var RepoActions = Biff.createActions({
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
  }
});

module.exports = RepoActions;
