const express = require('express');


const Order = require("../models/order");

exports.allorder=async(req,res)=>{
  try{
    const order=await Order.find();
  res.json(order)
  }catch(err){
      res.status(500).json({ message: err.message });
  }
}

exports.GetOrderOne= async (req, res) => {
  try {
    const { quotationNumber } = req.params;
    const order = await Order.findOne({quotationNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

