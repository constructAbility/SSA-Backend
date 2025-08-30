const Product = require('../models/Product');

// 🟢 Helper function to normalize arrays (relatedProductIds, tags, etc.)
const normalizeArray = (value, fallback = []) => {
  if (!value) return fallback;

  if (Array.isArray(value)) {
    return value.map(v => v.toString().trim());
  }

  if (typeof value === "string") {
    value = value.replace(/\\"/g, '"'); // remove escaped quotes
    if (value.trim() === "") return fallback;

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(v => v.toString().trim());
      }
    } catch {
      return value.split(",").map(v => v.trim()).filter(Boolean);
    }
  }

  return fallback;
};

// 🟢 Create Product
exports.createProduct = async (req, res) => {
  try {
    // If new image uploaded
    if (req.file) {
      req.body.productImage = req.file.path;  
    }

    // Handle relatedProductIds
    if (req.body.relatedProductIds) {
      req.body.relatedProductIds = normalizeArray(req.body.relatedProductIds, []);
    }

    // Handle tags
    if (req.body.tags) {
      req.body.tags = normalizeArray(req.body.tags, []);
    }
 req.body.bestSeller = req.body.bestSeller === "true" || req.body.bestSeller === true;

    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);

  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image: keep old one unless new uploaded
    let productImage = existingProduct.productImage;
    if (req.file) {
      productImage = req.file.path; // New uploaded file
    }

    // Destructure body
    let {
      productCategory,
      productName,
      productId,
      productDescription,
      relatedProductIds,
      tags,
      bestSeller
    } = req.body || {};

    // Normalize arrays
    relatedProductIds = normalizeArray(relatedProductIds, existingProduct.relatedProductIds);
    tags = normalizeArray(tags, existingProduct.tags);

    // Prepare update data
    const updateData = {
      productImage,
      productCategory: productCategory ?? existingProduct.productCategory,
      productName: productName ?? existingProduct.productName,
      productId: productId ?? existingProduct.productId,
      productDescription: productDescription ?? existingProduct.productDescription,
      relatedProductIds,
      tags,
        bestSeller: bestSeller !== undefined ? (bestSeller === "true" || bestSeller === true) : existingProduct.bestSeller
    };

    // Update in DB
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

// 🟢 Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.markBestSellers = async (req, res) => {
  try {
    const { productIds } = req.body; // send array of 5 product IDs

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Provide productIds array" });
    }

    // First reset all
    await Product.updateMany({}, { $set: { bestSeller: false } });

    // Mark only given IDs
    await Product.updateMany({ _id: { $in: productIds } }, { $set: { bestSeller: true } });

    res.json({ message: "Selected products marked as best sellers", productIds });
  } catch (error) {
    console.error("Mark Best Sellers Error:", error);
    res.status(500).json({ message: error.message });
  }
};