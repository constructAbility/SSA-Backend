const express = require('express');
const router = express.Router();
const { addToCart, getCart,delCart } = require('../controllers/cartController');
const auth = require('../middelware/authMiddleware');

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);
router.delete('/delete/item/:productId',auth,delCart);
module.exports = router;
