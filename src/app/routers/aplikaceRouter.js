// nacteni kodu baliku express
const express = require('express');
// vytvoreni objektu routeru
const router = express.Router();

// obsluha ruznych URL
router.get('/domov', (dotaz, odpoved) => odpoved.redirect('/index.html'));
router.get('/chyba', (dotaz, odpoved) => odpoved.redirect('/error.html'));

// export routeru ze souboru ven
module.exports = router;
