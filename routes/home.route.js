const express = require('express');
const router = express.Router();
const homeController = require('../controller/home.controller')

router
.get('/' , homeController.getHome);

router
.post("/", homeController.postUrl)

module.exports = router; 