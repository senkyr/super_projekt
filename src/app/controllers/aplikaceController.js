exports.domov = (dotaz, odpoved) => {
    odpoved.render('aplikace/index');
};

exports.chyba = (dotaz, odpoved) => {
    odpoved.render('aplikace/error');
};
