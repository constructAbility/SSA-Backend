const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
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
    const { id } = req.params;

    // Pehle existing product nikal lo
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Image handle karo
    let productImage = existingProduct.productImage;
    if (req.file) {
      productImage = `/uploads/${req.file.filename}`;
    }

    // Body fields le lo 
    let {
      productCategory,
      productName,
      productId,
      productDescription,
      relatedProductIds,
      tags
    } = req.body || {};

    // relatedProductIds handle karo
    if (typeof relatedProductIds === 'string') {
      relatedProductIds = relatedProductIds
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    } else if (!relatedProductIds) {
      relatedProductIds = existingProduct.relatedProductIds;
    }

    // tags handle karo
    if (typeof tags === 'string') {
      tags = tags
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    } else if (!tags) {
      tags = existingProduct.tags;
    }

    
    const updateData = {
      productImage,
      productCategory: productCategory ?? existingProduct.productCategory,
      productName: productName ?? existingProduct.productName,
      productId: productId ?? existingProduct.productId,
      productDescription: productDescription ?? existingProduct.productDescription,
      relatedProductIds,
      tags
    };

  
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error updating product',
      error: error.message
    });
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