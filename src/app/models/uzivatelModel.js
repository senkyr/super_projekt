// nacteni kodu z baliku bcryptjs
const bcrypt = require('bcryptjs');
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
    const hash = bcrypt.hashSync(heslo, 10);

    let next_id = db.get('next_id');

    db.set(next_id, {jmeno, heslo: hash});

    db.set('next_id', next_id + 1);
};

exports.overit = (jmeno, heslo) => {
    let data = db.JSON();

    delete data['next_id'];

    for(let id in data) {
        if(data[id]['jmeno'] == jmeno) {
            if(bcrypt.compareSync(heslo, data[id]['heslo'])) {
                return true;
            }
        }
    }

    return false;
};
