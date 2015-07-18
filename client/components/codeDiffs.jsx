// React
var React = require("react");

var CodeDiff = require("../components/codeDiff");

// Component
var CodeDiffs = React.createClass({
  displayName: "CodeDiffs",
  propTypes: {},
  mixins: [],

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
    var key = 0;
    var codeDiffNodes = this.props.codeDiffs.map(function (codeDiff) {
      return (
        <CodeDiff codeDiff={codeDiff} />
      );
    });
    return (
      <div>
        {codeDiffNodes}
      </div>
    );
  }
});

module.exports = CodeDiffs;
