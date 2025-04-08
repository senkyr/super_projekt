// nacteni balicku http
const http = require('http');
// nacteni kodu aplikace
const app = require('./app');

// nacteni dat z konfiguracniho souboru
require('dotenv').config();
// nacteni konkretnich konfiguracnich dat
const { PORT } = process.env;

// dotazy na server resi aplikace
const server = http.createServer(app);

// spusteni serveru
server.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}...`);
});
