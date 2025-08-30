const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCategory: String,
  productImage: String,
  productName: String,
  productId: String,
  productDescription: String,
  relatedProductIds: [String], // ✅ plural and consistent
  tags: [String],
  bestSeller: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
