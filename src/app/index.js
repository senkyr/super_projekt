// nacteni kodu z baliku 'express'
const express = require('express');

// vytvoreni Express aplikace
const app = express();

// prijimani dat z formularu
app.use(express.urlencoded({ extended: false }));

// umisteni statickych souboru (HTML, CSS, obrazky, ...)
app.use(express.static('./www'));

// odchyceni URL tykajicich se aplikace jako takove
app.use('/aplikace', require('./routers/aplikaceRouter'));
// odchyceni URL tykajicich se uzivatele
app.use('/uzivatel', require('./routers/uzivatelRouter'));

module.exports = app;
