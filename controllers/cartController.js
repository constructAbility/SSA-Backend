const Cart = require('../models/Cart');
const axios = require('axios');



exports.addToCart = async (req, res) => {
  const { productId, productname, quantity: rawQty } = req.body;
  const userId = req.user._id;

  if (!productId || !productname || rawQty === undefined) {
    return res.status(400).json({ message: 'productId, productname, and quantity are required' });
  }

  const quantity = Number(rawQty);
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a valid positive number' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const index = cart.items.findIndex(item => item.productId === productId);
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, productname, quantity });
      }
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, productname, quantity }]
      });
    }

    await cart.save();


    const { name, email, phone } = req.user;
    try {
      if (process.env.INTERNAL_API_BASE) {
        await axios.post(`${process.env.INTERNAL_API_BASE}/api/cart-entry`, {
          username: name,
          email,
          phone,
          productId,
          productname,
          quantity
        });
      }
    } catch (apiErr) {
      console.error('Internal API call failed:', apiErr.message);
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error('Cart Add Error:', err);
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
