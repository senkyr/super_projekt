// nacteni kodu z baliku 'express'
const express = require('express');

// vytvoreni Express aplikace
const app = express();

// umisteni statickych souboru (HTML, CSS, obrazky, ...)
app.use(express.static('./www'));

// odchyceni URL tykajici se aplikace jako takove
app.use('/aplikace', require('./routers/aplikaceRouter'));

module.exports = app;
