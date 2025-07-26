

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: String,
  productname: String,
  price: Number,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [cartItemSchema],
  totalAmount: Number
});

module.exports = mongoose.model('Cart', cartSchema);