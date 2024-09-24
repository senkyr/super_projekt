const model = require('../models/uzivatelModel');

exports.registrovat = (dotaz, odpoved) => {
    return odpoved.redirect('/registrace.html');
};
