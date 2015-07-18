// React
var React = require("react");
var LoginActions = require("../actions/login-actions");
var UserStore = require("../stores/user-store");

// Router
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

// constants
var Constants = require('../constants');

// Component
var SignIn = React.createClass({
  displayName: "select repo",
  propTypes: {},
  mixins: [UserStore.mixin, Router.Navigation],

  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      if(typeof query.repo !== "undefined" &&
        typeof query.path !== "undefined" &&
        typeof query.type !== "undefined") {
        transition.redirect('/home', params, query);
      }
      callback();
    },

    willTransitionFrom: function (transition, component) {
    }
  },

  getInitialState: function () { 
    return UserStore.getSignInAttr(); 
  },

  componentWillMount: function () {},

  componentWillUnmount: function () {
  },

  storeDidChange: function () {
    var nextPath = this.context.router.getCurrentQuery().nextPath;
    if (UserStore.isUserLoggedIn()) {
      if (nextPath) {
        this.transitionTo(nextPath);
      } 
      else {
        this.transitionTo('/home', {}, {path: '', type: Constants.CONTENT_TYPE_DIR});
      }
    }
    this.setState(UserStore.getSignInAttr());
  },

  login: function (e) {
    e.preventDefault();

    var repo = this.refs.inputRepo.getDOMNode().value;

    if (repo.trim()) {
      this.transitionTo('/home', {}, {repo: repo, path: '', type: Constants.CONTENT_TYPE_DIR});
    }
  },


  handleRepoChange: function (e) {
    LoginActions.loginRepoChanged(this.refs.inputRepo.getDOMNode().value);
  },

  render: function () {
    return (
      <div className="container">
        <form className="form-signin">
          <h2 className="form-signin-heading">Specify a GIT repo</h2>
          <label htmlFor="inputRepo" className="sr-only">Repo</label>
          <input type="text" onChange={this.handleRepoChange} value={this.state.repo} id="inputRepo" ref="inputRepo" className="form-control" placeholder="Repo" />
          <button className="btn btn-lg btn-primary btn-block" onClick={this.login} type="submit">Sign in</button>
        </form>

        <RouteHandler />
      </div>
    );
  }
});

module.exports = SignIn;
