// uzivatelController.js
// nacteni kodu modelu
const model = require('../models/uzivatelModel');

exports.registrovat = (dotaz, odpoved) => {
    odpoved.render('uzivatel/registrace', {
        nadpis: "Registrace",
        jmeno: dotaz.session.prihlasen,
    });
};

exports.registrovatPost = async (dotaz, odpoved) => {
    let jmeno = dotaz.body.jmeno.trim();
    let heslo = dotaz.body.heslo.trim();
    let kontrola = dotaz.body.heslo_kontrola.trim();

    if(jmeno == '' || heslo == '') {
        return odpoved.redirect('/uzivatel/registrovat');
    } else if(heslo != kontrola) {
        return odpoved.redirect('/uzivatel/registrovat');
    }
    
    try {
        // Kontrola existence uživatele - nyní s await
        const existuje = await model.existuje(jmeno);
        if(existuje) {
            return odpoved.redirect('/uzivatel/registrovat');
        }
        
        // Přidání uživatele - nyní s await
        await model.pridat(jmeno, heslo);
        odpoved.redirect('/uzivatel/prihlasit');
    } catch (err) {
        console.error('Chyba při registraci:', err);
        odpoved.redirect('/uzivatel/registrovat');
    }
};

exports.prihlasit = (dotaz, odpoved) => {
    odpoved.render('uzivatel/prihlaseni', {
        nadpis: "Přihlášení",
        jmeno: dotaz.session.prihlasen,
    });
};

exports.prihlasitPost = async (dotaz, odpoved) => {
    let jmeno = dotaz.body.jmeno.trim();
    let heslo = dotaz.body.heslo.trim();

    if(jmeno == '' || heslo == '') {
        return odpoved.redirect('/uzivatel/prihlasit');
    }
    
    try {
        // Kontrola existence uživatele - nyní s await
        const existuje = await model.existuje(jmeno);
        if(!existuje) {
            return odpoved.redirect('/uzivatel/prihlasit');
        }
        
        // Ověření hesla - nyní s await
        const overeno = await model.overit(jmeno, heslo);
        if(!overeno) {
            return odpoved.redirect('/uzivatel/prihlasit');
        }
        
        dotaz.session.prihlasen = jmeno;
        return odpoved.redirect('/uzivatel/profil');
    } catch (err) {
        console.error('Chyba při přihlášení:', err);
        odpoved.redirect('/uzivatel/prihlasit');
    }
};

exports.profil = (dotaz, odpoved) => {
    odpoved.render('uzivatel/profil', {
        nadpis: 'Profil',
        jmeno: dotaz.session.prihlasen,
    });
};

exports.odhlasit = (dotaz, odpoved) => {
    dotaz.session.destroy();
    odpoved.redirect('/aplikace/domov');
};
