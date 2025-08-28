const Product = require('../models/Product');
const mongoose = require('mongoose');
exports.createProduct = async (req, res) => {
  try {
    // 🖼️ Image handle (Cloudinary se secure_url milega)
    if (req.file) {
      req.body.productImage = req.file.path;  
    }

    // 🔗 Related Product IDs handle
    if (req.body.relatedProductIds) {
      let ids = [];
      if (Array.isArray(req.body.relatedProductIds)) {
        ids = req.body.relatedProductIds;
      } else if (typeof req.body.relatedProductIds === 'string') {
        if (req.body.relatedProductIds.trim() !== "") {
          try {
            ids = JSON.parse(req.body.relatedProductIds);
          } catch {
            ids = req.body.relatedProductIds.split(',').map(id => id.trim());
          }
        }
      }
      req.body.relatedProductIds = ids;
    }

    // ✅ Create product
    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);

  } catch (err) {
    console.error("Create Product Error:", err);
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

    // 🟢 Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🖼️ Image handle (Cloudinary se path aata hai)
    let productImage = existingProduct.productImage;
    if (req.file) {
      productImage = req.file.path; // ✅ Cloudinary URL
    }

    // 🟢 Helper function to normalize arrays
    const normalizeArray = (value, fallback = []) => {
      if (!value) return fallback;

      if (Array.isArray(value)) {
        return value.map((v) => v.toString().trim());
      }

      if (typeof value === "string") {
        if (value.trim() === "") return fallback;
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.map((v) => v.toString().trim());
          }
        } catch {
          return value.split(",").map((v) => v.trim()).filter(Boolean);
        }
      }

      return fallback;
    };

    // 🟢 Fields le lo from body
    let {
      productCategory,
      productName,
      productId,
      productDescription,
      relatedProductIds,
      tags,
    } = req.body || {};

    // ✅ Normalize relatedProductIds and tags
    relatedProductIds = normalizeArray(
      relatedProductIds,
      existingProduct.relatedProductIds
    );
    tags = normalizeArray(tags, existingProduct.tags);

    // 🟢 Prepare update data
    const updateData = {
      productImage,
      productCategory: productCategory ?? existingProduct.productCategory,
      productName: productName ?? existingProduct.productName,
      productId: productId ?? existingProduct.productId,
      productDescription: productDescription ?? existingProduct.productDescription,
      relatedProductIds,
      tags,
    };

    // 🟢 Update in DB
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
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