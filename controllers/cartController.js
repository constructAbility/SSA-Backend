const Cart = require('../models/Cart');
const axios = require('axios');

exports.addToCart = async (req, res) => {
  const { productId, productname, price: rawPrice, quantity: rawQty } = req.body;
  const userId = req.user._id.toString();

  const price = Number(rawPrice);
  const quantity = Number(rawQty);
  const total = price * quantity;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const index = cart.items.findIndex(item => item.productId === productId);
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, productname, price, quantity });
      }
      cart.totalAmount += total;
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, productname, price, quantity }],
        totalAmount: total
      });
    }

    await cart.save();

    const { name, email, phone } = req.user;

  
    if (process.env.INTERNAL_API_BASE) {
      await axios.post(`${process.env.INTERNAL_API_BASE}/api/cart-entry`, {
        username: name,
        email,
        phone,
        productId,
        productname,
        price,
        quantity,
        total
      });
    }

    res.json(cart);
  } catch (err) {
    console.error('Cart Add Error:', err.message);
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id.toString() });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};
