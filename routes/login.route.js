const express = require('express');
const router = express.Router();
const logInController = require('../controller/login.controller')

router
.get("/login" , logInController.getLogin);

router
.post('/login' , logInController.loginUser)

// router
// .patch("/login" , logInController.updateUser);

router
.get('/logout' , logInController.logOutUser);

module.exports = router;