const Product = require('../models/Product');

    const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {

    if (req.file) {
      req.body.productImage = `/uploads/${req.file.filename}`;
    }

  

if (typeof req.body.relatedProductIds === 'string') {
  try {
    const ids = JSON.parse(req.body.relatedProductIds);
    req.body.relatedProductId = ids.map(id => mongoose.Types.ObjectId(id));
  } catch (error) {
    return res.status(400).json({ message: 'Invalid relatedProductIds format' });
  }
}


    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
