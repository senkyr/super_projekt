// nacteni kodu baliku express
const express = require('express');
// vytvoreni objektu routeru
const router = express.Router();

// nacteni kodu controlleru
const controller = require('../controllers/aplikaceController');

// obsluha ruznych URL
router.get('/domov', controller.domov);
router.get('/chyba', controller.chyba);

// export routeru ze souboru ven
module.exports = router;
