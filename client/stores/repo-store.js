var Biff = require("../biff");
var _ = require("lodash");

// constants
var constants = require('../constants');

// Creates a DataStore
var RepoStore = Biff.createStore({        
  // Initial setup
  info: {},
  rObject: null,
  branches: [],
  currBranchIndex: 0,
  currPath: '',
  currContents: [],
  currType: constants.CONTENT_TYPE_DIR,
  currRepo: '',
  loading: true,
  codeDiff: [],
  appExit: true,
  workingFilesArr: [],

  getRObject: function () {
    return this.rObject;
  },

  getCurrBranch: function () {
    return this.branches[this.currBranchIndex];
  },

  getCurrPath: function () {
    return this.currPath;
  },

  getCurrContents: function () {
    return this.currContents;
  }
}, function (payload) {
  if (payload.actionType === "INIT_SUCCESS") {
    this.rObject = payload.repoObject;
    this.info = payload.repoInfo;
    this.branches = payload.repoBranches;
    this.currRepo = payload.repo;
    this.currPath = payload.path;
    this.currType = payload.type;

    this.loading = false;
    this.emitChange();
  }
  if (payload.actionType === "REPO_OPEN_DIR") {
    this.currContents = payload.currContents;
    this.currPath = payload.currPath;
    this.currType = constants.CONTENT_TYPE_DIR;
    this.loading = false;
    this.emitChange();
  }
  if (payload.actionType === "REPO_OPEN_FILE") {
    this.currContents = payload.currContents;
    this.currPath = payload.currPath;
    this.currType = constants.CONTENT_TYPE_FILE;
    this.loading = false;
    this.emitChange();
  }
  if (payload.actionType === "REPO_FILE_UPDATED") {
    this.currContents = payload.currContents;
    this.emitChange();
  }
  if (payload.actionType === "CODE_DIFF_UPDATED") {
    this.codeDiff = payload.codeDiff;
    this.emitChange();
  }
  if (payload.actionType === "REDIS_INIT") {
    this.appExit = payload.appExit;
    this.workingFilesArr = [];
    this.emitChange();
  }
  if (payload.actionType === "WORKING_FILES_UPDATED") {
    this.workingFilesArr = payload.workingFilesArr;
    this.emitChange();
  }
});

module.exports = RepoStore;
