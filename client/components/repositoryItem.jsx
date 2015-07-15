// React
var React = require("react");

// Router
var Link = require('react-router').Link;

// stores
var RepoStore = require("../stores/repo-store");

// actions
var RepoActions = require("../actions/repo-actions");

// constants
var Constants = require('../constants');

// Component
var RepositoryItem = React.createClass({
  displayName: "RepositoryItem",
  propTypes: {},
  mixins: [],

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
    return (
      <Link activeClassName="list-group-item active" 
          className="list-group-item" 
          to="home" 
          query={{
            path: this.props.item.path,
            type: this.props.item.type
          }}>
        {this.props.item.name}
      </Link>

    );
  }
});

module.exports = RepositoryItem;
