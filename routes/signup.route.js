const express = require('express');
const router = express.Router();
const signInController = require('../controller/signup.Controller')

//signup
router.get("/signup", signInController.getsignup);
router.post('/signup' , signInController.createUser);

module.exports = router;