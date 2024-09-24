// nacteni kodu baliku express
const express = require('express');
// vytvoreni objektu routeru
const router = express.Router();

// nacteni kodu controlleru
const controller = require('../controllers/uzivatelController');

// obsluha ruznych URL
router.get('/registrovat', controller.registrovat);
router.post('/registrovat', controller.registrovatPost);

// export routeru ze souboru ven
module.exports = router;
