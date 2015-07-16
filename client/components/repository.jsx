// React
var React = require("react");

// components
var RepositoryItem = require("../components/repositoryItem");

// Component
var Repository = React.createClass({
  displayName: "Repository",
  propTypes: {},
  mixins: [],
  self: this,

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
  	var repo = this.props.repo;
  	var repositoryItemNodes = this.props.contents.map(function (repositoryItem) {
	  	return (
	    	<RepositoryItem key={repositoryItem.sha} repo={repo} item={repositoryItem} />
	  	);
    });
    return (
      <div className="list-group">
	    {repositoryItemNodes}
	  </div>
    );
  }
});

module.exports = Repository;
