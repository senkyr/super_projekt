// nacteni kodu z baliku simple-json-db
const jsondb = require('simple-json-db');
// napojeni na soubor s daty
const db = new jsondb('../data/uzivatele.json');

exports.existuje = (jmeno) => {
    return db.has(jmeno);
};

exports.pridat = (jmeno, heslo) => {
    db.set(jmeno, heslo);
};
