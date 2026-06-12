const { db } = require('./firebase/admin');

const sampleProducts = [
  // ELECTRONICS (5 items)
  {
    title: "Quantum 6.7\" OLED Smartphone",
    description: "A state-of-the-art smartphone featuring a 120Hz refresh OLED display, quad-lens AI camera array with 100x digital zoom, 5000mAh battery, and ultra-fast octa-core processor.",
    category: "Electronics",
    price: 899.99,
    discountPrice: 799.99,
    stock: 15,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Apex Core 15.6\" Gaming Laptop",
    description: "Power your play with the latest Gen Intel Core i9 processor, NVIDIA RTX 4070 Graphics, 32GB DDR5 RAM, and a 1TB PCIe NVMe SSD. Dynamic RGB keyboard and cooling technology included.",
    category: "Electronics",
    price: 1499.99,
    discountPrice: 1399.99,
    stock: 8,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1496181130204-755241524eab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Vortex Wireless ANC Earbuds",
    description: "True wireless earbuds with active noise cancellation, custom dynamic drivers, up to 36 hours of battery life with case, and IPX7 sweat/water resistance.",
    category: "Electronics",
    price: 129.99,
    discountPrice: 99.99,
    stock: 40,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Chronos Waterproof Smartwatch",
    description: "An elegant smartwatch tracking steps, sleep, heart rate, blood oxygen, and sports. Features a vibrant AMOLED touchscreen and 14-day battery life.",
    category: "Electronics",
    price: 199.99,
    discountPrice: null,
    stock: 25,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Aura Portable Bluetooth Speaker",
    description: "Compact waterproof speaker with booming 360-degree sound, deep bass, customizable RGB LED light ring, and 24 hours of continuous playback.",
    category: "Electronics",
    price: 79.99,
    discountPrice: 69.99,
    stock: 30,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },

  // FASHION (5 items)
  {
    title: "Classic Denim Blue Jacket",
    description: "A timeless outerwear addition crafted from 100% heavy denim cotton. Vintage washing finish, metal buttons, chest flap pockets, and buttoned cuffs.",
    category: "Fashion",
    price: 69.99,
    discountPrice: 59.99,
    stock: 25,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Airstride Lightweight Running Shoes",
    description: "Engineered mesh running shoes featuring reactive air cushioning midsoles, rubber waffle grip soles, and reflective highlights for nighttime training.",
    category: "Fashion",
    price: 119.99,
    discountPrice: 89.99,
    stock: 20,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Eclipse Polarized Sunglasses",
    description: "Fashionable shades providing complete UV400 protection. Shatterproof polycarbonate frames and polarization to filter highway and water glare.",
    category: "Fashion",
    price: 49.99,
    discountPrice: null,
    stock: 50,
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Heritage Slim Leather Wallet",
    description: "Handcrafted from full-grain vegetable-tanned leather. RFID-blocking layer, 6 card slots, a cash bill partition, and quick-access utility slot.",
    category: "Fashion",
    price: 39.99,
    discountPrice: 29.99,
    stock: 35,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1627124718515-e222909fcc65?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Urban Fleece Hooded Sweatshirt",
    description: "Super soft combed cotton hoodie featuring fleece interiors, double-lined hoods, drawstring adjustments, and spacious kangaroo pouch pocket.",
    category: "Fashion",
    price: 54.99,
    discountPrice: null,
    stock: 30,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },

  // HOME (5 items)
  {
    title: "BrewMaster Thermal Espresso Maker",
    description: "Brew barista-quality espresso at home. Features 19-bar pressure extraction, integrated milk frother steam wand, cup warmer tray, and full programmable digital touchscreen control.",
    category: "Home",
    price: 299.99,
    discountPrice: 249.99,
    stock: 12,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Ceramic Cookware 10-Piece Set",
    description: "Non-stick, non-toxic ceramic coated pots and pans with secure glass lids and stay-cool handles. Oven-safe, dishwasher-safe, and compatible with all stovetops including induction.",
    category: "Home",
    price: 179.99,
    discountPrice: null,
    stock: 18,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "PureAir True HEPA Air Purifier",
    description: "High-efficiency 3-stage filtration system capturing 99.97% of airborne dust, pollen, smoke, and odors. Perfect for bedrooms and large living rooms.",
    category: "Home",
    price: 149.99,
    discountPrice: 129.99,
    stock: 15,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Lumina Minimalist LED Desk Lamp",
    description: "Eye-friendly LED desk lamp with 5 brightness levels, 5 color temperature settings, adjustable swing arm, and built-in USB charging port for smart devices.",
    category: "Home",
    price: 34.99,
    discountPrice: null,
    stock: 40,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Cozy Sherpa Fleece Throw Blanket",
    description: "Reversible super soft plush blanket with smooth flannel top and thick warm sherpa fleece underside. Machine washable and perfect for lounging.",
    category: "Home",
    price: 29.99,
    discountPrice: 24.99,
    stock: 50,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },

  // SPORTS (5 items)
  {
    title: "FlexFlow Premium Eco Yoga Mat",
    description: "Eco-friendly, dual-textured non-slip yoga mat with alignment grid lines. 6mm thick cushioning to protect knees and elbows during training.",
    category: "Sports",
    price: 39.99,
    discountPrice: 34.99,
    stock: 45,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "IronGrip Hex Rubber Dumbbells",
    description: "Professional dumbbells set with solid cast iron core, ergonomic chrome knurled handles, and hexagonal rubber encased heads to prevent rolling.",
    category: "Sports",
    price: 89.99,
    discountPrice: null,
    stock: 15,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Nomad Water-Resistant Hiking Backpack",
    description: "Lightweight 40L outdoor travel backpack. Features durable ripstop nylon, rain cover, multiple gear loops, and breathable mesh back pads.",
    category: "Sports",
    price: 79.99,
    discountPrice: 64.99,
    stock: 25,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "HydroPeak Vacuum Insulated Bottle",
    description: "Double-walled stainless steel flask keeping beverages cold for 24 hours or hot for 12 hours. Sweat-free coating with wide-mouth sports cap.",
    category: "Sports",
    price: 24.99,
    discountPrice: null,
    stock: 100,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "SmashPro Composite Tennis Racket",
    description: "Carbon composite frames designed for beginners and intermediate players. Pre-strung with high tension, comfortable grip wrap, and carry case.",
    category: "Sports",
    price: 149.99,
    discountPrice: 129.99,
    stock: 10,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1617083266333-5a534ad7cdbe?w=800&auto=format&fit=crop&q=80"
    ],
    createdAt: new Date().toISOString()
  }
];

async function seed() {
  console.log('[Seeder] Initializing Firestore connection...');
  try {
    const productsRef = db.collection('products');
    
    // Clean out previous products to ensure fresh seeding
    console.log('[Seeder] Clearing old products...');
    const snapshot = await productsRef.get();
    
    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('[Seeder] Successfully cleared existing items.');
    }
    
    // Insert new product list
    console.log('[Seeder] Seeding 20 sample products...');
    for (const prod of sampleProducts) {
      const docRef = await productsRef.add(prod);
      console.log(`[Seeder] Created product: "${prod.title}" with ID: ${docRef.id}`);
    }
    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] CRITICAL SEEDING FAILURE:', error.message);
    console.warn('[Seeder] Make sure your Firebase environment variables are correctly set in .env.');
    process.exit(1);
  }
}

seed();
