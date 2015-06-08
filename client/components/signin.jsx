// React
var React = require("react");
var LoginActions = require("../actions/login-actions");
var UserStore = require("../stores/user-store");

// Router
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

// Component
var SignIn = React.createClass({
  displayName: "Sign In",
  propTypes: {},
  mixins: [],

  getInitialState: function () { 
    return {
      token: "7f3529f067191a4894b736b91cc10ef1c01ee352",
      repo: "https://github.com/abrarsheikh/IntegerCompression.git"
    }; 
  },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  storeDidChange: function () {

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

  render: function () {
    return (
      <div className="container">

        <form className="form-signin">
          <h2 className="form-signin-heading">Please signin to GIT</h2>
          <label for="inputToken" className="sr-only">Token</label>
          <input type="text" value={this.state.token} id="inputToken" ref="inputToken" className="form-control" placeholder="Token" />
          <label for="inputRepo" className="sr-only">Repo</label>
          <input type="text" value={this.state.repo} id="inputRepo" ref="inputRepo" className="form-control" placeholder="Repo" />
          <button className="btn btn-lg btn-primary btn-block" onClick={this.login.bind(this)} type="submit">Sign in</button>
        </form>

        <RouteHandler />
      </div>
    );
  }
});

module.exports = SignIn;
