
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  productCategory: String,
  productImage: String, 
  productName: String,
  productIds: String,
  productDescription: String,
  relatedProductId: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Product'
}],

  tags:[String]
},{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);
