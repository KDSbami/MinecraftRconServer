const ScriptServer = require('scriptserver');


const server = new ScriptServer();
server.use(require('scriptserver-event'));
server.use(require('scriptserver-util'));
server.use(require('scriptserver-command'));
server.use(require('scriptserver-json'));


module.exports = server;