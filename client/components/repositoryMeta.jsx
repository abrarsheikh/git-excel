// React
var React = require("react");

var RepoStore = require("../stores/repo-store");

// Component
var RepositoryMeta = React.createClass({
  displayName: "RepositoryMeta",
  propTypes: {},
  mixins: [],

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  render: function () {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <dl className="dl-horizontal">
              <dt>Owner</dt>
              <dd><a href={this.props.data.owner.html_url} target="_blank">{this.props.data.owner.login}</a></dd>
            </dl>
          </div>
          <div className="col-md-6">
            <dl className="dl-horizontal">
              <dt>Repository</dt>
              <dd><a href={this.props.data.html_url} target="_blank">{this.props.data.name}</a></dd>
            </dl>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <dl className="dl-horizontal">
              <dt>SSH</dt>
              <dd>{this.props.data.ssh_url}</dd>
            </dl>
          </div>
          <div className="col-md-6">
            <dl className="dl-horizontal">
              <dt>path</dt>
              <dd>/{this.props.path}</dd>
            </dl>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <button onClick={this.props.getDiff} type="button" className="btn btn-success">Get Diff</button>
            <button onClick={this.props.resetRedis} type="button" className="btn btn-danger">Reset</button>
            <button onClick={this.props.email} type="button" className="btn btn-primary">Email</button>
          </div>
          <div className="col-md-6">
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RepositoryMeta;




// branch drop down
// <div className="row">
//     <div className="dropdown">
//       <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
//         Branches
//         <span className="caret"></span>
//       </button>
//       <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
//         {branchNodes}
//       </ul>
//     </div>
// </div>
