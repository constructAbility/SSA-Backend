const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


const sheets = require('./Sheet_Route/Inq');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productroute=require('./routes/product');
// const OrderDetails=require('./routes/orderDetails')

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));



app.use('/api', sheets);               
app.use('/api/auth', authRoutes);      
app.use('/api/cart', cartRoutes);  
app.use('/api/product',productroute);    
// app.use('/api/order',OrderDetails)

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
