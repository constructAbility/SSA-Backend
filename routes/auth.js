const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authCont');

router.post('/register', register);
router.post('/login', login);
// router.post('/admin/register', registerAdmin); 
// router.post('/admin/login',adminlogin)
module.exports = router;
