
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // productTitle: String,
  productCategory: String,
  productImage: String, 
  productName: String,
  productId: String,
  // productPrice: Number,
  productDescription: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
