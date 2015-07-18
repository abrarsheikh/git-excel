// React
var React = require("react");

// Component
var CodeDiff = React.createClass({
  displayName: "CodeDiff",
  propTypes: {},
  mixins: [],

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
  	var key = 0;
    var lines = this.props.codeDiff.docDiff.map(function (line) {
    	var spanStyle;
        if (line.added) {
         	spanStyle = {
	        	'background-color': '#eaffea'
	        };
        } else if (line.removed) {
        	spanStyle = {
	        	'background-color': '#ffecec'
	        };
        } else {
        	spanStyle = {
	        	color: 'grey'
	        };
        }
		return (
			<span style={spanStyle}>{line.value}</span>
		);
    });

    return (
      	<div className="panel panel-default">
		  <div className="panel-heading">
		    <h3 className="panel-title">{this.props.codeDiff.path}</h3>
		  </div>
		  <div className="panel-body">
		    <pre>
		    	{lines}
		    </pre>
		  </div>
		</div>
    );
  }
});

module.exports = CodeDiff;
