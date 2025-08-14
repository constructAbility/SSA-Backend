const mongoose = require('mongoose');
const Product = require('./models/Product'); // tera Product model ka path

// Tera data array
const products = [
  {
    productCategory: "Electrical",
    productName: "Wiring Kit",
    productId: "1",
    productDescription: "Complete wiring kit with cables, terminals, and connectors for domestic and industrial use.",
    relatedProductIds: [6, 10, 3],
    tags: ["wiring", "kit", "cables"],
    price: 499,
    bestSeller: true
  },
  {
    productCategory: "Electrical",
    productName: "LED Light",
    productId: "2",
    productDescription: "Energy-saving LED panel light ideal for indoor lighting.",
    relatedProductIds: [8, 10, 3],
    tags: ["light", "LED", "energy-saving"],
    price: 299,
    bestSeller: false
  },
{
    productCategory: "Electrical",
    productName: "Wiring Kit",
    productId: "1",
    productDescription: "Complete wiring kit with cables, terminals, and connectors for domestic and industrial use.",
    relatedProductIds: [6, 10, 3],
    tags: ["wiring", "kit", "cables"],
    price: 499,
    bestSeller: true
  },
  {
    productCategory: "Electrical",
    productName: "LED Light",
    productId: "2",
    productDescription: "Energy-saving LED panel light ideal for indoor lighting.",
    relatedProductIds: [8, 10, 3],
    tags: ["light", "LED", "energy-saving"],
    price: 299,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "Switch Board",
    productId: "3",
    productDescription: "Modular electric switch board with universal compatibility.",
    relatedProductIds: [9, 2, 1],
    tags: ["switch", "board", "modular"],
    price: 399,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "Ceiling Fan",
    productId: "4",
    productDescription: "Energy-efficient ceiling fan with high-speed motor.",
    relatedProductIds: [2, 10, 30],
    tags: ["fan", "cooling", "electrical"],
    price: 1500,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "MCB Box",
    productId: "5",
    productDescription: "Miniature Circuit Breaker box for household electrical protection.",
    relatedProductIds: [1, 3, 10],
    tags: ["MCB", "safety", "breaker"],
    price: 999,
    bestSeller: true
  },
  {
    productCategory: "Electrical",
    productName: "Wire Cutter",
    productId: "6",
    productDescription: "Precision wire cutter for electrical installations and maintenance.",
    relatedProductIds: [1, 10],
    tags: ["tool", "wire", "cutter"],
    price: 250,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "Voltage Tester",
    productId: "7",
    productDescription: "Digital voltage tester for safety checks and diagnostics.",
    relatedProductIds: [6, 5],
    tags: ["tester", "voltage", "safety"],
    price: 150,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "Bulb Holder",
    productId: "8",
    productDescription: "Durable bulb holder compatible with standard bulbs.",
    relatedProductIds: [2, 9],
    tags: ["bulb", "holder", "light"],
    price: 120,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "Power Socket",
    productId: "9",
    productDescription: "Universal power socket with surge protection.",
    relatedProductIds: [3, 10],
    tags: ["socket", "power", "electrical"],
    price: 180,
    bestSeller: false
  },
  {
    productCategory: "Electrical",
    productName: "Electrical Tape",
    productId: "10",
    productDescription: "Insulated electrical tape for wire protection and safety.",
    relatedProductIds: [6, 1, 5],
    tags: ["tape", "electrical", "insulation"],
    price: 49,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Water Pipe",
    productId: "11",
    productDescription: "Flexible PVC water pipe ideal for plumbing systems.",
    relatedProductIds: [12, 13, 20],
    tags: ["pipe", "PVC", "water"],
    price: 199,
    bestSeller: true
  },
  {
    productCategory: "Plumbing",
    productName: "PVC Elbow",
    productId: "12",
    productDescription: "Durable elbow fitting to change pipe direction.",
    relatedProductIds: [11, 13],
    tags: ["fitting", "elbow", "PVC"],
    price: 49,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Pipe Cutter",
    productId: "13",
    productDescription: "Tool for precise cutting of PVC pipes.",
    relatedProductIds: [11, 12],
    tags: ["tool", "cutter", "pipe"],
    price: 499,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Tap Handle",
    productId: "14",
    productDescription: "Chrome finish tap handle for modern plumbing fixtures.",
    relatedProductIds: [15, 17],
    tags: ["tap", "handle", "plumbing"],
    price: 150,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Shower Head",
    productId: "15",
    productDescription: "Modern overhead shower head for bathrooms.",
    relatedProductIds: [14, 18],
    tags: ["shower", "bathroom", "head"],
    price: 399,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Drain Trap",
    productId: "16",
    productDescription: "Plastic drain trap for sinks and basins.",
    relatedProductIds: [19, 18],
    tags: ["drain", "trap", "sink"],
    price: 249,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Angle Valve",
    productId: "17",
    productDescription: "Brass angle valve used in water inlet control.",
    relatedProductIds: [14, 20],
    tags: ["valve", "angle", "plumbing"],
    price: 189,
    bestSeller: true
  },
  {
    productCategory: "Plumbing",
    productName: "Flexible Hose",
    productId: "18",
    productDescription: "Flexible stainless steel hose for water connections.",
    relatedProductIds: [15, 17],
    tags: ["hose", "flexible", "steel"],
    price: 199,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Flush Valve",
    productId: "19",
    productDescription: "Toilet flush valve mechanism for efficient water use.",
    relatedProductIds: [16, 20],
    tags: ["flush", "toilet", "valve"],
    price: 349,
    bestSeller: false
  },
  {
    productCategory: "Plumbing",
    productName: "Pipe Sealant",
    productId: "20",
    productDescription: "Sealant for leak-proof pipe connections.",
    relatedProductIds: [11, 12, 17],
    tags: ["sealant", "pipe", "plumbing"],
    price: 99,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Solar Panel",
    productId: "21",
    productDescription: "High-efficiency polycrystalline solar panel.",
    relatedProductIds: [22, 24, 25],
    tags: ["solar", "panel", "renewable"],
    price: 1500,
    bestSeller: true
  },
  {
    productCategory: "Solar",
    productName: "Inverter",
    productId: "22",
    productDescription: "Wall-mounted inverter for solar energy systems.",
    relatedProductIds: [21, 23, 24],
    tags: ["solar", "inverter", "conversion"],
    price: 2500,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Charge Controller",
    productId: "23",
    productDescription: "Digital charge controller to regulate battery charging.",
    relatedProductIds: [22, 26],
    tags: ["controller", "charge", "solar"],
    price: 999,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Solar Battery",
    productId: "24",
    productDescription: "Tubular solar battery for reliable energy storage.",
    relatedProductIds: [22, 23],
    tags: ["battery", "solar", "storage"],
    price: 3000,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Mounting Kit",
    productId: "25",
    productDescription: "Mounting kit for rooftop solar panel installation.",
    relatedProductIds: [21, 26],
    tags: ["mounting", "kit", "solar"],
    price: 799,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Solar Cable",
    productId: "26",
    productDescription: "Durable solar cable for PV systems.",
    relatedProductIds: [25, 23],
    tags: ["cable", "solar", "PV"],
    price: 249,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "DC Combiner Box",
    productId: "27",
    productDescription: "Combiner box for managing multiple solar panel outputs.",
    relatedProductIds: [21, 22],
    tags: ["DC", "box", "combiner"],
    price: 699,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Solar Lamp",
    productId: "28",
    productDescription: "Portable solar-powered LED lamp for indoor and outdoor use.",
    relatedProductIds: [26, 30],
    tags: ["lamp", "solar", "LED"],
    price: 599,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "MC4 Connectors",
    productId: "29",
    productDescription: "Standard MC4 connectors for solar panel wiring.",
    relatedProductIds: [26, 21],
    tags: ["connector", "MC4", "solar"],
    price: 99,
    bestSeller: false
  },
  {
    productCategory: "Solar",
    productName: "Solar Charge Cable",
    productId: "30",
    productDescription: "High-quality cable for solar charging systems.",
    relatedProductIds: [26, 28],
    tags: ["cable", "solar", "charge"],
    price: 399,
    bestSeller: false
  }
];

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
