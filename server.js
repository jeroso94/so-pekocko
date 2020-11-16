/* TODO --

[FRONTEND]
    1/ Installer le FrontEnd

[SECURITE]
    1/ Configurer le HTTPS OWASP#2 - Lutter contre piratage de session/Transit des données
    2/ Désactiver les entités externes OWASP#3 - vulnérabilités XXE
    3/ Upgrader à la version actuelle tous les composants du framework et les modules applicatifs OWASP#6
    4/ Intégrer bibliothèque SerialKiller et la vérification des fonctionnalités des objets OWASP#8
*/

const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
