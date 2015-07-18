// React
var React = require("react");
var request = require('superagent');

// actions
var RepoActions = require("../actions/repo-actions");

// stores
var UserStore = require("../stores/user-store");
var RepoStore = require("../stores/repo-store");

// components
var Repository = require("../components/repository");
var File = require("../components/file");
var RepositoryMeta = require("../components/repositoryMeta");

// Router
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

// constants
var Constants = require('../constants');

// Component
var Home = React.createClass({
  displayName: "Home",
  propTypes: {},
  mixins: [RepoStore.mixin, Router.Navigation],
  statics: {
    willTransitionTo: function (transition, params, query) {
      // if (!UserStore.isUserLoggedIn()) {
      //   transition.redirect('/signin', params, query);
      // }
      return true;
    },
    willTransitionFrom: function (transition, component) {
    }
  },

  getInitialState: function () { 
    return {
      repoInfo: RepoStore.info,
      contentType: Constants.CONTENT_TYPE_DIR,
      contents: [],
      path: null,
      currBranchIndex: RepoStore.currBranchIndex,
      repo: RepoStore.currRepo,
      loading: RepoStore.loading,
      appExit: RepoStore.appExit
    };
  },

  componentWillMount: function () {
    RepoActions.init(this.props.query.repo, this.props.query.path, this.props.query.type);
  },

  componentWillUnmount: function () {},

  componentDidMount: function () {
    var self = this;
    
      // this.repoLoadAction(this.props.query.path, this.props.query.type);
  },

  storeDidChange: function () { 
    if (this.state.loading != RepoStore.loading) {
      this.repoLoadAction(this.props.query.path, this.props.query.type);
    }
    this.setState({
      contents: RepoStore.getCurrContents(),
      path: RepoStore.getCurrPath(),
      contentType: RepoStore.currType,
      repo: RepoStore.currRepo,
      repoInfo: RepoStore.info,
      currBranchIndex: RepoStore.currBranchIndex,
      loading: RepoStore.loading
    });
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.query.path != this.props.query.path) {
      this.repoLoadAction(nextProps.query.path, nextProps.query.type);
    }
  },

  shouldComponentUpdate: function () {
    // if (this.state.contentType === Constants.CONTENT_TYPE_DIR) {
    //   if (this.props.query.path === this.state.path) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // } else {
    //   return true;
    // }
    return true;
  },

  componentDidUpdate: function () {
    if (this.state.contentType === Constants.CONTENT_TYPE_DIR) {

    }
  },

  repoLoadAction: function (path, type) {
    if (path != this.state.path) {
      RepoActions.open(RepoStore.getRObject(), this.state.currBranchIndex, path, type);
    }
  },

  getDiff: function(e) {
    this.transitionTo('sendEmail', {}, {repo: this.props.query.repo});
  },

  resetRedis: function(e) {
    RepoActions.initRedis(this.props.query.repo);
  },

  email: function(e) {
    var emails = prompt("Enter To Email Address");
    RepoActions.email(this.props.query.repo, emails);
  },

  render: function () {
    if(this.state.loading) {
      return (
        <div>
        </div>
      );
    }
    if (this.state.contentType === Constants.CONTENT_TYPE_DIR) {
      return (
        <div>
          <RepositoryMeta email={this.email.bind(this)} resetRedis={this.resetRedis.bind(this)} getDiff={this.getDiff.bind(this)} data={this.state.repoInfo}  path={this.state.path} />
          <div className="container-fluid">
            <Repository repo={this.state.repo} contents={this.state.contents} />
          </div>
          <RouteHandler />
        </div>
      );
    } else if (this.state.contentType === Constants.CONTENT_TYPE_FILE) {
      return (
        <div>
          <RepositoryMeta email={this.email.bind(this)} resetRedis={this.resetRedis.bind(this)} getDiff={this.getDiff.bind(this)} data={this.state.repoInfo} path={this.state.path}/>
          <File contents={this.state.contents} repo={this.state.repo} path={this.state.path}/>
        </div>
      )
    } 
  }
});

module.exports = Home;
