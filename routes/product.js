const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const adminAuth = require('../middelware/authMiddleware');
const multer = require("multer");
const path = require("path");

const upload = require('../middelware/upload');





// router.post('/products', upload.single('productImage'), productController.createProduct);
router.post('/add', adminAuth, upload.single('productImage'), productController.createProduct);;
router.get('/all',adminAuth,productController.getAllProducts);
router.get('/:id', adminAuth,productController.getProductById);
router.put('/:id', adminAuth,  upload.single('productImage'),productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;

