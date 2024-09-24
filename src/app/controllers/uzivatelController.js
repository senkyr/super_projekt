// nacteni kodu modelu
const model = require('../models/uzivatelModel');

exports.registrovat = (dotaz, odpoved) => {
    return odpoved.redirect('/registrace.html');
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
