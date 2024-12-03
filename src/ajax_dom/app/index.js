const express = require('express');

const app = express();

app.use(express.json());
app.use(express.static('./www'));

app.get('/hello', (dotaz, odpoved) => {
    odpoved.json({ hello: 'world' });
});

app.post('/prijem', (dotaz, odpoved) => {
    const data = dotaz.body.data;

    console.log(data);

    odpoved.end();
});

module.exports = app;
