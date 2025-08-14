const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    if (req.file) {
      req.body.productImage = `/uploads/${req.file.filename}`;
    }

    // ✅ Handle relatedProductIds in multiple formats
    if (req.body.relatedProductIds) {
      let ids = [];
      try {
        if (Array.isArray(req.body.relatedProductIds)) {
          ids = req.body.relatedProductIds;
        } else if (typeof req.body.relatedProductIds === 'string') {
          try {
            // Try JSON parse first
            ids = JSON.parse(req.body.relatedProductIds);
          } catch {
            // Fallback: split comma-separated string
            ids = req.body.relatedProductIds.split(',').map(id => id.trim());
          }
        }
        req.body.relatedProductIds = ids;
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
    if (req.file) {
      req.body.productImage = `/uploads/${req.file.filename}`;
    }

    if (req.body.relatedProductIds) {
      let ids = [];
      try {
        if (Array.isArray(req.body.relatedProductIds)) {
          ids = req.body.relatedProductIds;
        } else if (typeof req.body.relatedProductIds === 'string') {
          try {
            ids = JSON.parse(req.body.relatedProductIds);
          } catch {
            ids = req.body.relatedProductIds.split(',').map(id => id.trim());
          }
        }
        req.body.relatedProductIds = ids;
      } catch (error) {
        return res.status(400).json({ message: 'Invalid relatedProductIds format' });
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

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
