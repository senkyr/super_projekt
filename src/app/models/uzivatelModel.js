const jsondb = require('simple-json-db');

const db = new jsondb('../data/uzivatele.json');

exports.existuje = (jmeno) => {
    return db.has(jmeno);
};

exports.pridat = (jmeno, heslo) => {
    db.set(jmeno, heslo);
};
