// React
var React = require("react");
var sjs = require('../sjs');

// components
var RepositoryItem = require("../components/repositoryItem");

// stores
var RepoStore = require("../stores/repo-store");

// actions
var RepoActions = require("../actions/repo-actions");

// Component
var File = React.createClass({
  displayName: "File",
  propTypes: {},
  mixins: [],

  getInitialState: function () { 
    return {
      doc: null,
      cm: null
    }
  },

  componentDidMount: function () {
    var self = this;
    var elem = document.getElementById('pad');
    cm = CodeMirror.fromTextArea(elem);
    var fileInfo = CodeMirror.findModeByFileName(this.props.path);
    if (fileInfo) {
      cm.setOption("mode", fileInfo.mime);
      CodeMirror.autoLoadMode(cm, fileInfo.mode);
    }
    
    doc = sjs.get('users', this.props.path);
    var self = this;
    doc.subscribe(function() {
      RepoActions.updateFile(doc.snapshot);
    });
    doc.whenReady(function () {
      if (!doc.type) doc.create('text', self.props.contents);
      if (doc.type && doc.type.name === 'text') {
        doc.attachCodeMirror(cm);
        RepoActions.updateFile(doc.snapshot);
      }
      var context = doc.createContext();
      context._onOp = function(op) {
        RepoActions.updateFile(this.getSnapshot());
      };
    });
  },

  componentWillUnmount: function () {
    doc.unsubscribe();
    doc.del();
  },

  render: function () {
    return (
      <div className="container-fluid">
  	    <textarea id="pad" value={this.props.contents} />
  	  </div>
    );
  }
});

module.exports = File;
