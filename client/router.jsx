// React
var React = require("react");
var Router = require("react-router");
var App = require("./components/app");
var SignIn = require("./components/signin");
var Home = require("./components/home");
var NotFound = require("./components/notfound");

// Request
var request = require("superagent");

// Set up Router object
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

// Declare routes
var routes = (
  <Route handler={App} path="/">
    <Route path="signin" handler={SignIn} />
    <Route name="home" path="home" handler={Home} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

module.exports = {
  run: function (el) {
    Router.run(routes, function (Handler, state) {
      var params = state.params;
      React.render(<Handler params={params} />, el);
    });
  }
};
