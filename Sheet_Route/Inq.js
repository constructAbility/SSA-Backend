require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");
const Order = require("../models/order");
const Counter = require("../models/Counter");
const sendEmail = require('../utils/sendEmail');
const router = express.Router();


async function generateQuotationNumber() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); 
  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  const prefix = `${year}${month}`;  

  let counter = await Counter.findOne({ prefix });

  if (!counter) {
    counter = new Counter({ prefix, count: 1000 });
  } else {
    counter.count += 1;
  }

  await counter.save();

  const serialStr = counter.count.toString().padStart(4, '0'); 
  return prefix + serialStr; 
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const appendToSheet = async (range, values) => {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
};

function getFormattedDateTime() {
  const now = new Date();

  const istDateTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
  }).formatToParts(now);

  let dateParts = {};
  istDateTime.forEach(({ type, value }) => {
    dateParts[type] = value;
  });

  const formattedDate = `${dateParts.day}/${dateParts.month}/${dateParts.year}`;
  const formattedTime = `${dateParts.hour}:${dateParts.minute}:${dateParts.second} ${dateParts.dayPeriod}`;

  return `${formattedDate} ${formattedTime}`;
}

//yaha imq jo j wo order place wala route h 
router.post("/inq", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (
      !customer ||
      !customer.email ||
      !customer.firstName ||
      !customer.lastName ||
      !customer.address ||
      !customer.city ||
      !customer.pincode ||
      !customer.phone ||
      !items?.length
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quotationNumber = await generateQuotationNumber();

    const order = new Order({
      customer,
      items,
      quotationNumber,
      createdAt: new Date(),
    });

    await order.save();

    const fullName = `${customer.firstName} ${customer.lastName}`;
    const productSummary = items
      .map((item) => `${item.productname} (x${item.quantity})`)
      .join(", ");
        const formattedDateTime = getFormattedDateTime();

    await appendToSheet("INQ!A1:I", [
      quotationNumber,
      fullName,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      customer.pincode,
      productSummary,
      formattedDateTime,
    ]);
      const emailContent = `
       <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="height: 100vh"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="border: 1px solid #e0e0e0"
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="
                  background: #fff;
                  padding: 15px 0;
                  border-bottom: 3px solid #1744a1;
                "
              >
                <a href="https://ssaenterprises.com/" target="_blank">
                  <img
                    src="https://res.cloudinary.com/dpk2qxvkb/image/upload/v1754552334/logo-ssa-2_jojbs5.png"
                    alt="logo"
                    style="height: 60px"
                  />
                </a>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding: 30px 20px 10px">
                <h2 style="font-size: 24px; color: #1744a1; margin: 0">
                  Quotation - ${quotationNumber}
                </h2>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td align="left" style="padding: 10px 30px">
                <p style="font-size: 16px; color: #333; margin: 0">
                  Hello <strong>${fullName}</strong>,
                </p>
                <p style="font-size: 16px; color: #333; margin: 10px 0">
                  Thank you for your enquiry. Here is your quotation:
                </p>
              </td>
            </tr>

            <!-- Items List -->
            <tr>
              <td align="left" style="padding: 10px 30px">
                <ul
                  style="
                    font-size: 15px;
                    color: #1744a1;
                    padding-left: 20px;
                    margin: 0;
                  "
                >
                  ${items .map( item => `
                  <li>
                    ${item.productname} - ₹${item.price} x ${item.quantity}
                  </li>
                  ` ) .join("")}
                </ul>
              </td>
            </tr>

            <!-- Customer Details -->
            <tr>
              <td align="left" style="padding: 20px 30px">
                <p style="font-size: 15px; color: #333; margin: 5px 0">
                  <strong>Address:</strong> ${customer.address},
                  ${customer.city} - ${customer.pincode}
                </p>
                <p style="font-size: 15px; color: #333; margin: 5px 0">
                  <strong>Phone:</strong> ${customer.phone}
                </p>
                <p style="font-size: 15px; color: #333; margin: 5px 0">
                  <strong>Date:</strong> ${formattedDateTime}
                </p>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="padding: 20px 30px; font-size: 14px; color: #555"
              >
                <p style="margin: 0">
                  If you have any questions, please contact:
                  <a href="tel: +91 9910248056" style="text-decoration: none; color: #555;">+91 9910248056</a>
                  <a
                    href="tel: +91 7690904679"
                    style="text-decoration: none; color: #555;"
                    >+91 7690904679</a
                  >
                </p>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="
                  background: #f5f5f5;
                  padding: 15px;
                  color: #1744a1;
                  font-size: 13px;
                  font-weight: bold;
                "
              >
                Copyright © 2024, SSA Enterprises, All Rights Reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
      
      
    `;
     await sendEmail(customer.email, `Your Quotation - ${quotationNumber}`, emailContent);

    res.status(201).json({
      message: "Order placed successfully",
      quotationNumber,
      order,
    });
  } catch (err) {
    console.error("Order Error:", err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
});

router.get('/all-order',async(req,res)=>{
  try{
    const order=await Order.find();
  res.json(order)
  }catch(err){
      res.status(500).json({ message: err.message });
  }
})

router.get('/order/:QT', async (req, res) => {
  try {
    const { qquotationNumber } = req.params;
    const order = await Order.findOne({quotationNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/cart-entry", async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      productId,
      productname,
      price,
      quantity,
      total,
    } = req.body;
    const formattedDateTime = getFormattedDateTime();
await appendToSheet("CART!A2:I", [
      username,
      email,
      phone,
      productId,
      productname,
      price,
      quantity,
      total,
      formattedDateTime,
    ]);

    res.status(200).json({ message: "Sheet updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sheet update failed" });
  }
});

module.exports = router;
