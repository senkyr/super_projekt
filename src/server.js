// nacteni kodu z baliku 'express'
const express = require('express');

// vytvoreni Express aplikace
const app = express();

// funkce obsluhujici HTTP dotazy
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// spusteni aplikace
app.listen(8000);
