// React
var React = require("react");

// components
var RepositoryItem = require("../components/repositoryItem");

// Component
var Repository = React.createClass({
  displayName: "Repository",
  propTypes: {},
  mixins: [],

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
  	var repositoryItemNodes = this.props.contents.map(function (repositoryItem) {
	  	return (
	    	<RepositoryItem key={repositoryItem.sha} item={repositoryItem} />
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
