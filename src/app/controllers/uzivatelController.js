// nacteni kodu modelu
const model = require('../models/uzivatelModel');

exports.registrovat = (dotaz, odpoved) => {
    odpoved.render('uzivatel/registrace');
};

exports.registrovatPost = (dotaz, odpoved) => {
    let jmeno = dotaz.body.jmeno.trim();
    let heslo = dotaz.body.heslo.trim();
    let kontrola = dotaz.body.heslo_kontrola.trim();

    if(jmeno == '' || heslo == '') {
        return odpoved.redirect('/uzivatel/registrovat');
    } else if(heslo != kontrola) {
        return odpoved.redirect('/uzivatel/registrovat');
    } else if(model.existuje(jmeno)) {
        return odpoved.redirect('/uzivatel/registrovat');
    }

    model.pridat(jmeno, heslo);

    odpoved.redirect('/prihlaseni.html');
};

exports.prihlasit = (dotaz, odpoved) => {
    odpoved.render('uzivatel/prihlaseni');
};

exports.prihlasitPost = (dotaz, odpoved) => {
    let jmeno = dotaz.body.jmeno.trim();
    let heslo = dotaz.body.heslo.trim();

    if(jmeno == '' || heslo == '') {
        return odpoved.redirect('/uzivatel/prihlasit');
    } else if(!model.existuje(jmeno)) {
        return odpoved.redirect('/uzivatel/prihlasit');
    } else if(!model.overit(jmeno, heslo)) {
        return odpoved.redirect('/uzivatel/prihlasit');
    }

    dotaz.session.prihlasen = jmeno;

    return odpoved.redirect('/uzivatel/profil');
};

exports.profil = (dotaz, odpoved) => {
    odpoved.render('uzivatel/profil', {
        jmeno: dotaz.session.prihlasen,
    });
};

exports.odhlasit = (dotaz, odpoved) => {
    dotaz.session.destroy();

    odpoved.redirect('/aplikace/domov');
};
