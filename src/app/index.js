// nacteni kodu z baliku express
const express = require('express');
// nacteni kodu z baliku express-session
const session = require('express-session');

// nacteni dat z konfiguracniho souboru
require('dotenv').config();
// nacteni konkretnich konfiguracnich dat
const { SECRET } = process.env;

// vytvoreni Express aplikace
const app = express();

// prijimani dat z formularu
app.use(express.urlencoded({ extended: false }));

// nastaveni session
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// umisteni statickych souboru (HTML, CSS, obrazky, ...)
app.use(express.static('./www'));

// odchyceni URL tykajicich se aplikace jako takove
app.use('/aplikace', require('./routers/aplikaceRouter'));
// odchyceni URL tykajicich se uzivatele
app.use('/uzivatel', require('./routers/uzivatelRouter'));

module.exports = app;
