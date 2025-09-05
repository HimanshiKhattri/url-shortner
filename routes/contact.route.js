const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact.controller');

router.get('/contact' , contactController.getContactPage);

router.post('/contact' , contactController.getContactDetails);

module.exports = router;