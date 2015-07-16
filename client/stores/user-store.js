var Biff = require("../biff");
var _ = require("lodash");
var cookie = require('react-cookie');

// Creates a DataStore
var UserStore = Biff.createStore({
  // Initial setup
  loggedIn: false,
  repo: "https://github.com/abrarsheikh/IntegerCompression.git",
  repoObject: null,

  getSignInAttr: function () {
    return {
      repo: this.repo
    }
  },
  isUserLoggedIn: function () {
    return this.loggedIn;
  }
}, function (payload) {
  if (payload.actionType === "SIGNIN_FAILED") {
    this.loggedIn = false;
    this.emitChange();
  }
  if (payload.actionType === "SIGNIN_SUCCESS") {
    this.loggedIn = true;
    this.token = payload.token;
    this.repoObject = payload.repoObject;
    this.repoInfo = payload.payload;
    this.repoBranches = payload.repoBranches;
    this.emitChange();
  }
  if (payload.actionType === "LOGIN_INPUT_CHANGED") {
    if (payload.type === "token") 
      this.token = payload.data;
    if (payload.type === "repo")
      this.repo = payload.data;
    this.emitChange();
  }
});

module.exports = UserStore;
