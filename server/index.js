var fs = require('fs');
var path = require('path');
var glob = require('glob');
var defer = require('node-promise').defer;

var http = require('http');
var connect = require('connect');
var io = require('socket.io');

var assets = {
  scripts: {},
  styles: {}
};

var connectionPort = 8111;
var clientdir = path.join(process.cwd(), 'client');
var app = connect().use(connect.static(clientdir));
var server = http.createServer(app);

var socket = io.listen(server);
socket.sockets.on('connection', function(socket) {
  console.log('Socket connection.');
  socket.emit('assets', assets);
});

function appendScript(filename, script) {
  assets.scripts[filename] = script;
}

function appendStyle(filename, style) {
  assets.styles[filename] = style;
}

function loadAssetsFromDir(dirGlob, appender) {
  var dfd = defer();
  glob(dirGlob, function(err, matches) {
    var count = (matches) ? matches.length : 0;
    if(err) {
      console.error('Could not load scripts: ' + err);
      dfd.resolve();
    }
    matches.forEach(function(filepath) {
      fs.readFile(filepath, function(err, data) {
        if(!err) {
          appender.call(null, path.basename(filepath), data.toString());
        }
        if(--count === 0) {
          dfd.resolve();
        }
      });
    });
  });
  return dfd;
}

loadAssetsFromDir(path.join(clientdir, 'script', '*.js'), appendScript)
  .then(function() {
    loadAssetsFromDir(path.join(clientdir, 'style', '*.css'), appendStyle);
  })
  .then(function() {
    server.listen(connectionPort, function() {
      console.log('Server started at http://localhost:' + connectionPort);
    });
  });
