// nacteni balicku http
const http = require('http');
// nacteni kodu aplikace
const app = require('./app');

// dotazy na server resi aplikace
const server = http.createServer(app);

// spusteni serveru
server.listen(8000, 'localhost', () => {
    console.log('Server běží na http://localhost:8000...');
});
