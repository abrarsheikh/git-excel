// React
var React = require("react");
var sjs = require('../sjs');
var request = require('superagent');

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
    var self = this;
    if (fileInfo) {
      cm.setOption("mode", fileInfo.mime);
      CodeMirror.autoLoadMode(cm, fileInfo.mode);
    }
    
    this.state.doc = sjs.get(this.props.repo, this.props.path);
    var self = this;
    this.state.doc.subscribe(function() {
      RepoActions.updateFile(self.state.doc.snapshot);
    });
    
    this.state.doc.whenReady(function () {
      if (!self.state.doc.type)  {
        self.state.doc.create('text', self.props.contents);
        request
          .post('/api/newDoc')
          .send({ 
            repo: self.props.repo,
            docPath: self.props.path,
            doc: self.props.contents
          })
          .set('Accept', 'application/json')
          .end(function(err, res){
            console.log(res.body);
          }
        );
      }
      if (self.state.doc.type && self.state.doc.type.name === 'text') {
        self.state.doc.attachCodeMirror(cm);
        RepoActions.updateFile(self.state.doc.snapshot);
      }
      // var context = doc.createContext();
    });
  },

  componentWillUnmount: function () {
    var self = this;
    this.state.doc.unsubscribe();
    request
      .post('/api/updateDoc')
      .send({ 
        repo: self.props.repo,
        docPath: self.props.path,
        doc: self.state.doc.snapshot
      })
      .set('Accept', 'application/json')
      .end(function(err, res){
        console.log(res.body);
      }
    );
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
