// nacteni kodu z baliku simple-json-db
const jsondb = require('simple-json-db');
// napojeni na soubor s daty
const db = new jsondb('../data/uzivatele.json');

// inicializace polozky next_id v prazdne databazi
if(!db.has('next_id')) {
    db.set('next_id', 1);
}

exports.existuje = (jmeno) => {
    let data = db.JSON();

    delete data['next_id'];

    for(let id in data) {
        if(data[id]['jmeno'] == jmeno) {
            return true;
        }
    }

    return false;
};

exports.pridat = (jmeno, heslo) => {
    let next_id = db.get('next_id');

    db.set(next_id, {jmeno, heslo});

    db.set('next_id', next_id + 1);
};
