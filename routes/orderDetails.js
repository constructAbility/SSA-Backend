const express = require('express');
const router = express.Router();
const{allorder,GetOrderOne}=require('../controllers/orderController');

router.get('/all-order',allorder);
router.get('/order/:id',GetOrderOne);


module.exports = router;