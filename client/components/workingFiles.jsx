// React
var React = require("react");

// Component
var WorkingFiles = React.createClass({
  displayName: "WorkingFiles",
  propTypes: {},
  mixins: [],
  self: this,

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
    var fileNodes = this.props.workingFilesArr.map(function (file) {
      return (
        <li className="list-group-item">{file}</li>
      );
    });
    return (
      <div className="container-fluid">
        <div className="panel panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title">Currently editing files</h3>
          </div>
          <div className="panel-body">
            <ul className="list-group">
              {fileNodes}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = WorkingFiles;
