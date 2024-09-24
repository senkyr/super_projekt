const express = require('express');

const router = express.Router();

const controller = require('../controllers/uzivatelController');

router.get('/registrovat', controller.registrovat);
router.post('/registrovat', controller.registrovatPost);

module.exports = router;
