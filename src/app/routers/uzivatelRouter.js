const express = require('express');

const router = express.Router();

const controller = require('../controllers/uzivatelController');

router.get('/registrovat', controller.registrovat);

module.exports = router;
