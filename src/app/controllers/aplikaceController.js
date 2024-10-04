exports.domov = (dotaz, odpoved) => {
    odpoved.render('aplikace/index', {
        nadpis: "Moje aplikace",
        jmeno: dotaz.session.prihlasen,
    });
};

exports.chyba = (dotaz, odpoved) => {
    odpoved.render('aplikace/error', {
        nadpis: "Došlo k chybě",
        jmeno: dotaz.session.prihlasen,
    });
};
