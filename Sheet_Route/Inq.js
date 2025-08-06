require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");
const Order = require("../models/order");
const router = express.Router();

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

    const order = new Order({
      customer,
      items,

      createdAt: new Date(),
    });

    await order.save();

    const fullName = `${customer.firstName} ${customer.lastName}`;
    const productSummary = items
      .map((item) => `${item.productname} (x${item.quantity})`)
      .join(", ");

    await appendToSheet("INQ!A1:H", [
      fullName,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      customer.pincode,
      productSummary,

      new Date().toLocaleString(),
    ]);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order Error:", err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
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

    //  console.log("Received data:", req.body);
    await appendToSheet("CART!A2:I", [
      username,
      email,
      phone,
      productId,
      productname,
      price,
      quantity,
      total,
      new Date().toLocaleString(),
    ]);

    res.status(200).json({ message: "Sheet updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sheet update failed" });
  }
});

module.exports = router;
