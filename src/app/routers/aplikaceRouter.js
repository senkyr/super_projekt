const express = require('express');

const router = express.Router();

router.get('/domov', (dotaz, odpoved) => odpoved.redirect('/index.html'));
router.get('/chyba', (dotaz, odpoved) => odpoved.redirect('/error.html'));

module.exports = router;
