const mongoose = require('mongoose');
const Product = require('./models/Product'); // tera Product model ka path

// Tera data array
const products = [
     {
      id: 30,
      name: "Solar Fan",
      img: assets.TableTop,
      category: "Solar",
      price: 1200,
      description: "Energy-saving solar-powered tabletop fan.",
      relatedProductIds: [28, 4],
      tags: ["fan", "solar", "cooling"],
    },

    // Electronics
    {
      id: 31,
      name: "Circuit Board",
      img: assets.CircuitBoard,
      category: "Electronics",
      price: 999,
      description: "Multi-layered PCB for electronic project assembly.",
      relatedProductIds: [33, 34, 40],
      tags: ["PCB", "circuit", "board"],
    },
    {
      id: 32,
      name: "Sensor",
      img: assets.SensorModule,
      category: "Electronics",
      price: 799,
      description: "Sensor module compatible with Arduino for automation.",
      relatedProductIds: [40, 33],
      tags: ["sensor", "module", "automation"],
    },
    {
      id: 33,
      name: "Microcontroller",
      img: assets.MicrocontrollerBoard,
      category: "Electronics",
      price: 1199,
      description: "Programmable board for controlling electronics.",
      relatedProductIds: [40, 32],
      tags: ["microcontroller", "programming", "board"],
    },
    {
      id: 34,
      name: "Resistor Pack",
      img: assets.Resistorswith,
      category: "Electronics",
      price: 99,
      description: "Pack of various resistors for circuit building.",
      relatedProductIds: [35, 36],
      tags: ["resistor", "electronics", "components"],
    },
    {
      id: 35,
      name: "Breadboard",
      img: assets.SolderlessBreadboard,
      category: "Electronics",
      price: 149,
      description: "Solderless breadboard for rapid prototyping.",
      relatedProductIds: [34, 36],
      tags: ["breadboard", "testing", "prototype"],
    },
    {
      id: 36,
      name: "Jumper Wires",
      img: assets.Jumperwires,
      category: "Electronics",
      price: 89,
      description: "Flexible jumper wires for breadboard connections.",
      relatedProductIds: [35, 34],
      tags: ["jumper", "wire", "connection"],
    },
    {
      id: 37,
      name: "Transistor Kit",
      img: assets.Transistor,
      category: "Electronics",
      price: 249,
      description: "Assorted transistors for electronic circuits.",
      relatedProductIds: [34, 38],
      tags: ["transistor", "components", "electronics"],
    },
    {
      id: 38,
      name: "Relay Module",
      img: assets.RelayModule,
      category: "Electronics",
      price: 399,
      description: "Relay module for high-voltage switching.",
      relatedProductIds: [33, 37],
      tags: ["relay", "module", "switching"],
    },
    {
      id: 39,
      name: "LCD Display",
      img: assets.LCDDisplay,
      category: "Electronics",
      price: 499,
      description: "LCD module for microcontroller-based display projects.",
      relatedProductIds: [40, 33],
      tags: ["LCD", "display", "electronics"],
    },
    {
      id: 40,
      name: "Arduino UNO",
      img: assets.ArduinoUNOboard,
      category: "Electronics",
      price: 1450,
      description:
        "Popular Arduino UNO board for beginner to advanced electronics.",
      relatedProductIds: [32, 33, 35],
      tags: ["arduino", "microcontroller", "UNO"],
    },  ];

async function seedDB() {
  try {
    await mongoose.connect('mongodb+srv://enterpricesssa:SAA2025@ssadatabase.mqs6quf.mongodb.net/?retryWrites=true&w=majority&appName=SSADATABASE');

    console.log('MongoDB connected ✅');

    await Product.deleteMany({}); // purana data clean karne ke liye
    console.log('Old products removed');

    await Product.insertMany(products);
    console.log('New products added ✅');

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

seedDB();
