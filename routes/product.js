const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const adminAuth = require('../middelware/authMiddleware');
const multer = require("multer");
const path = require("path");

const upload = require('../middelware/upload');





// router.post('/products', upload.single('productImage'), productController.createProduct);
router.post('/add', adminAuth, upload.single('productImage'), productController.createProduct);;
router.get('/all',productController.getAllProducts);
router.get('/:id',productController.getProductById);
router.put('/:id', adminAuth,  upload.single('productImage'),productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);
router.post('/best', productController.markBestSellers);


module.exports = router;

