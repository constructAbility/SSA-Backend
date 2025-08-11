const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


const sheets = require('./Sheet_Route/Inq');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productroute=require('./routes/product');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', sheets);               
app.use('/api/auth', authRoutes);      
app.use('/api/cart', cartRoutes);  
app.use('/api/product',productroute);    


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
