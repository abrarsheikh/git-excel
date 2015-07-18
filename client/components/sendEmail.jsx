// React
var React = require("react");

var CodeDiffs = require("../components/codeDiffs");

// actions
var RepoActions = require("../actions/repo-actions");

var RepoStore = require("../stores/repo-store");

// Component
var SendEmail = React.createClass({
  displayName: "SendEmail",
  propTypes: {},
  mixins: [RepoStore.mixin],

  getInitialState: function () { 
    return {
      diffs: []
    };
  },

  componentWillMount: function () {
    RepoActions.getDiffClicked(this.props.query.repo);
  },

  componentWillUnmount: function () {},

  storeDidChange: function () {
    this.setState({
      diffs: RepoStore.codeDiff
    });
  },

  render: function () {
    return (
      <CodeDiffs codeDiffs={this.state.diffs} />
    );
  }
});

module.exports = SendEmail;
