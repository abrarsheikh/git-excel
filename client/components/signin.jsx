// React
var React = require("react");
var LoginActions = require("../actions/login-actions");
var UserStore = require("../stores/user-store");

// Router
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

// constants
var Constants = require('../constants');

require('../hello_init')

// Component
var SignIn = React.createClass({
  displayName: "Sign In",
  propTypes: {},
  mixins: [UserStore.mixin, Router.Navigation],

  getInitialState: function () { 
    return UserStore.getSignInAttr(); 
  },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

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

    var token = this.refs.inputToken.getDOMNode().value;
    var repo = this.refs.inputRepo.getDOMNode().value;

    if (token.trim()) {
      LoginActions.loginByToken({
        token: token,
        repo: repo
      });
    }

    this.setState({
      token: token,
      repo: repo
    });
  },

  login2: function (network){
    debugger;
    var github = hello('github');

    github.login( function(){
    });
  },

  handleTokenChange: function (e) {
    LoginActions.loginTokenChanged(this.refs.inputToken.getDOMNode().value);
  },

  handleRepoChange: function (e) {
    LoginActions.loginRepoChanged(this.refs.inputRepo.getDOMNode().value);
  },

  render: function () {
    return (
      <div className="container">

        <form className="form-signin">
          <h2 className="form-signin-heading">Please signin to GIT</h2>
          <label htmlFor="inputToken" className="sr-only">Token</label>
          <input type="text" onChange={this.handleTokenChange} value={this.state.token} id="inputToken" ref="inputToken" className="form-control" placeholder="Token" />
          <label htmlFor="inputRepo" className="sr-only">Repo</label>
          <input type="text" onChange={this.handleRepoChange} value={this.state.repo} id="inputRepo" ref="inputRepo" className="form-control" placeholder="Repo" />
          <button className="btn btn-lg btn-primary btn-block" onClick={this.login} type="submit">Sign in</button>
          <button onClick={this.login2}>github</button>
        </form>

        <RouteHandler />
      </div>
    );
  }
});

module.exports = SignIn;
