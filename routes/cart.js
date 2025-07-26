const express = require('express');
const router = express.Router();
const { addToCart, getCart } = require('../controllers/cartController');
const auth = require('../middelware/authMiddleware');

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);

module.exports = router;
