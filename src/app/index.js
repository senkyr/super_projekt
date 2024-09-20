// nacteni kodu z baliku 'express'
const express = require('express');

// vytvoreni Express aplikace
const app = express();

// umisteni statickych souboru (HTML, CSS, obrazky, ...)
app.use(express.static('./www'));

// funkce obsluhujici HTTP dotazy
app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

app.get('/bye', function(req, res) {
    res.send('Good bye!');
});

module.exports = app;
