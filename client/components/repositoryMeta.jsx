// React
var React = require("react");

// Router
var Link = require('react-router').Link;

var RepoStore = require("../stores/repo-store");

// constants
var Constants = require('../constants');

// Component
var RepositoryMeta = React.createClass({
  displayName: "RepositoryMeta",
  propTypes: {},
  mixins: [],

  getInitialState: function () { return null; },

  componentWillMount: function () {},

  componentWillUnmount: function () {},

  getPathSegments: function(path) {
    var parts,
    i,
    runningPath = '',
    runningIndex = 1,
    self = this;
    if (path.trim() === '') {
      return;
    } else {
      parts = path.split("/");
      var pathNodes = parts.map(function (part) {
        runningPath = runningPath + ((runningIndex === 1 ? '' : '/') + part);
        return (
          <Link to="home" 
              query={{
                repo: self.props.repo,
                path: runningPath,
                type: (runningIndex === parts.length && self.props.type === Constants.CONTENT_TYPE_FILE) ? Constants.CONTENT_TYPE_FILE : Constants.CONTENT_TYPE_DIR
              }}>
            {runningIndex++ === 1 ? '' : '/'}{part}&nbsp;
          </Link>
        );
      });
      return pathNodes;
    }
  },

  render: function () {

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6">
                <dl className="dl-horizontal">
                  <dt>path</dt>
                  <dd><Link to="home" 
                      query={{
                        repo: this.props.repo,
                        path: '',
                        type: Constants.CONTENT_TYPE_DIR
                      }}>
                    {'/'}
                    &nbsp;
                  </Link>
                  {this.getPathSegments(this.props.path)}</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="dl-horizontal">
                  <dt>Owner</dt>
                  <dd><a href={this.props.data.owner.html_url} target="_blank">{this.props.data.owner.login}</a></dd>
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
                  <dt>Repository</dt>
                  <dd><a href={this.props.data.html_url} target="_blank">{this.props.data.name}</a></dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="btn-group" role="group" aria-label="...">
                <button onClick={this.props.getDiff} type="button" className="btn btn-success">Get Diff</button>
                <button onClick={this.props.email} type="button" className="btn btn-primary">Email</button>
                <button onClick={this.props.resetRedis} type="button" className="btn btn-danger">Reset</button>
            </div>
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
