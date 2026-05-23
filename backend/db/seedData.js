const seedData = {
  categories: [
    { id: 1, name: "Mobiles", image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Electronics", image_url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=200&auto=format&fit=crop" },
    { id: 3, name: "Fashion", image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop" },
    { id: 4, name: "Furniture", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop" },
    { id: 5, name: "Appliances", image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop" },
    { id: 6, name: "Grocery", image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop" },
    { id: 7, name: "Beauty", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop" },
    { id: 8, name: "Home", image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=200&auto=format&fit=crop" },
    { id: 9, name: "Toys", image_url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=200&auto=format&fit=crop" },
    { id: 10, name: "Auto", image_url: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=200&auto=format&fit=crop" },
    { id: 11, name: "Two Wheelers", image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=200&auto=format&fit=crop" },
    { id: 12, name: "Sports", image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200&auto=format&fit=crop" },
    { id: 13, name: "Books", image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop" }
  ],
  products: [
    // --- MOBILES (Category 1) ---
    {
      id: 1,
      category_id: 1,
      name: "Apple iPhone 15 Pro (Natural Titanium, 128 GB)",
      price: 127990.00,
      mrp: 134900.00,
      rating: 4.7,
      rating_count: 8432,
      review_count: 512,
      description: "Experience the ultimate iPhone experience with Apple iPhone 15 Pro. Featuring a strong and light aerospace-grade titanium design, a massive camera upgrade with a 48MP Main camera, and the industry-defining A17 Pro chip for next-level mobile gaming and efficiency.",
      stock: 25,
      specifications: {
        "Brand": "Apple",
        "Model Name": "iPhone 15 Pro",
        "Color": "Natural Titanium",
        "Storage": "128 GB",
        "Screen Size": "6.1 inches",
        "Primary Camera": "48MP + 12MP + 12MP",
        "Secondary Camera": "12MP Front Camera",
        "Processor": "A17 Pro Chip",
        "OS": "iOS 17"
      },
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1695048133036-749e755582f3?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 2,
      category_id: 1,
      name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
      price: 129999.00,
      mrp: 139999.00,
      rating: 4.8,
      rating_count: 5211,
      review_count: 420,
      description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility. Features a 200MP Main camera, integrated S Pen, Snapdragon 8 Gen 3 processor, and an extraordinary Corning Gorilla Armor screen display.",
      stock: 30,
      specifications: {
        "Brand": "Samsung",
        "Model Name": "Galaxy S24 Ultra",
        "Color": "Titanium Gray",
        "Storage": "256 GB",
        "RAM": "12 GB",
        "Screen Size": "6.8 inches",
        "Primary Camera": "200MP + 50MP + 12MP + 10MP",
        "Processor": "Snapdragon 8 Gen 3",
        "Battery": "5000 mAh"
      },
      images: [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 3,
      category_id: 1,
      name: "OnePlus 12 5G (Silky Black, 256 GB)",
      price: 64999.00,
      mrp: 69999.00,
      rating: 4.6,
      rating_count: 3120,
      review_count: 185,
      description: "The OnePlus 12 redefine speed and elegance. Combining standard Snapdragon 8 Gen 3 power with 100W SUPERVOOC charging, a beautiful 2K 120Hz ProXDR display, and 4th Gen Hasselblad Camera System for mobile.",
      stock: 45,
      specifications: {
        "Brand": "OnePlus",
        "Model Name": "12 5G",
        "Color": "Silky Black",
        "Storage": "256 GB",
        "RAM": "12 GB",
        "Screen Size": "6.82 inches",
        "Battery": "5400 mAh",
        "Charging": "100W Wired + 50W Wireless"
      },
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"
      ]
    },

    // --- ELECTRONICS (Category 2) ---
    {
      id: 4,
      category_id: 2,
      name: "Apple MacBook Air Apple M2 - (8 GB/256 GB SSD/macOS Ventura)",
      price: 84990.00,
      mrp: 99900.00,
      rating: 4.7,
      rating_count: 14529,
      review_count: 980,
      description: "Redesigned around the next-generation M2 chip, the MacBook Air is strikingly thin and brings exceptional speed and power efficiency inside its durable all-aluminum enclosure. It's the ultra-capable, ultra-portable laptop that lets you work, play, or create just about anything.",
      stock: 15,
      specifications: {
        "Brand": "Apple",
        "Model Name": "MacBook Air M2",
        "Processor": "Apple M2 Chip",
        "RAM": "8 GB Unified Memory",
        "Storage": "256 GB SSD",
        "Screen Size": "13.6 inches Liquid Retina",
        "OS": "macOS Ventura",
        "Battery Life": "Up to 18 Hours"
      },
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 5,
      category_id: 2,
      name: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
      price: 29990.00,
      mrp: 34990.00,
      rating: 4.5,
      rating_count: 4890,
      review_count: 382,
      description: "Sony's industry-leading noise cancellation gets even better. Experience magnificent sound quality, exceptionally clear hands-free calls, and a ultra-comfortable design with the WH-1000XM5 wireless headphones. Powered by 8 microphones and dual processors.",
      stock: 40,
      specifications: {
        "Brand": "Sony",
        "Model Name": "WH-1000XM5",
        "Color": "Black",
        "Headphone Type": "Over the Ear",
        "Battery Life": "Up to 30 Hours",
        "Bluetooth Version": "5.2",
        "Charging Time": "3 min charge for 3 hrs playback"
      },
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop"
      ]
    },

    // --- FASHION (Category 3) ---
    {
      id: 6,
      category_id: 3,
      name: "Roadster Men Solid Casual Shirt (Dark Blue)",
      price: 649.00,
      mrp: 1499.00,
      rating: 4.0,
      rating_count: 24500,
      review_count: 2132,
      description: "Add a touch of definition to your casual wear collection with this stylish dark blue shirt from Roadster. Tailored with 100% premium cotton, it offers a regular fit and curved hemline, perfect for office days or weekend hangouts.",
      stock: 120,
      specifications: {
        "Brand": "Roadster",
        "Size": "L",
        "Fabric": "100% Cotton",
        "Fit": "Regular Fit",
        "Pattern": "Solid",
        "Sleeve": "Full Sleeve",
        "Collar": "Spread Collar"
      },
      images: [
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 7,
      category_id: 3,
      name: "Nike Air Max Excee Running Shoes For Men",
      price: 5999.00,
      mrp: 7995.00,
      rating: 4.3,
      rating_count: 1240,
      review_count: 98,
      description: "Inspired by the classic Nike Air Max 90, the Nike Air Max Excee is a celebration of a classic through a new lens. Elongated lines and distorted proportions on the upper bring the iconic look into a modern space while visible Air cushioning keeps you comfortable.",
      stock: 50,
      specifications: {
        "Brand": "Nike",
        "Model": "Air Max Excee",
        "Color": "White/Black/Red",
        "Outer Material": "Mesh, Synthetic Leather",
        "Sole Material": "Rubber",
        "Ideal For": "Men",
        "Occasion": "Sports/Casual"
      },
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop"
      ]
    },

    // --- FURNITURE (Category 4) ---
    {
      id: 8,
      category_id: 4,
      name: "Sleephead Bae Queen Size Engineered Wood Platform Bed",
      price: 10499.00,
      mrp: 18999.00,
      rating: 4.4,
      rating_count: 3410,
      review_count: 290,
      description: "Get home the Bae Platform Bed by Sleephead and sleep like royalty. Crafted with durable high-grade engineered wood in a natural wenge finish, it brings modern style and sturdy construction to your bedroom layout.",
      stock: 8,
      specifications: {
        "Brand": "Sleephead",
        "Bed Size": "Queen",
        "Material": "Engineered Wood",
        "Finish Color": "Wenge",
        "Delivery Condition": "Knock Down (Assembly Required)",
        "Dimensions": "Width: 156 cm, Height: 78 cm, Depth: 206 cm"
      },
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 9,
      category_id: 4,
      name: "Green Soul Seoul Ergonomic Office Chair",
      price: 4299.00,
      mrp: 8990.00,
      rating: 4.2,
      rating_count: 15200,
      review_count: 1420,
      description: "Work in total comfort with the Green Soul Seoul Mesh Ergonomic Chair. Features standard lower back support, premium breathable mesh, heavy-duty metal base, and smooth dual-wheel casters for effortless mobility.",
      stock: 25,
      specifications: {
        "Brand": "Green Soul",
        "Model": "Seoul",
        "Color": "Black",
        "Material": "High Density Mesh",
        "Base": "Nylon",
        "Maximum Load Capacity": "110 kg",
        "Height Adjustable": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600&auto=format&fit=crop"
      ]
    },

    // --- APPLIANCES (Category 5) ---
    {
      id: 10,
      category_id: 5,
      name: "LG 8 kg 5 Star Inverter Fully Automatic Front Load Washing Machine",
      price: 34990.00,
      mrp: 42990.00,
      rating: 4.6,
      rating_count: 8530,
      review_count: 671,
      description: "LG Front Load washing machines feature standard 6 Motion Direct Drive technology, which moves the wash drum in multiple directions to give fabrics an ultra-gentle clean. Highly energy-efficient with a certified 5-star rating.",
      stock: 12,
      specifications: {
        "Brand": "LG",
        "Washing Capacity": "8 kg",
        "Energy Rating": "5 Star",
        "Control Type": "Fully Automatic Front Load",
        "Inverter Tech": "Yes, Direct Drive Inverter",
        "Max Spin Speed": "1400 RPM",
        "Warranty": "2 Years comprehensive, 10 Years on Motor"
      },
      images: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 11,
      category_id: 5,
      name: "Samsung 322 L 3 Star Convertible Double Door Refrigerator",
      price: 36990.00,
      mrp: 46990.00,
      rating: 4.5,
      rating_count: 5120,
      review_count: 320,
      description: "Store all your food fresh and healthy with Samsung's Twin Cooling Plus Convertible double-door refrigerator. Provides optimal humidity and temperature control in both the fridge and freezer independently, with 5 conversion modes.",
      stock: 10,
      specifications: {
        "Brand": "Samsung",
        "Capacity": "322 L",
        "Defrosting Type": "Frost Free",
        "Compressor Type": "Digital Inverter",
        "Energy Rating": "3 Star",
        "Convertible": "Yes, 5-in-1 Modes"
      },
      images: [
        "https://images.unsplash.com/photo-1571175432247-5c868dbb09ef?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=600&auto=format&fit=crop"
      ]
    },

    // --- GROCERY (Category 6) ---
    {
      id: 12,
      category_id: 6,
      name: "Fortune Premium Kachi Ghani Mustard Oil (1 L Bottle)",
      price: 165.00,
      mrp: 195.00,
      rating: 4.4,
      rating_count: 45290,
      review_count: 2310,
      description: "Fortune Kachi Ghani Pure Mustard Oil is cold-pressed from high-grade mustard seeds. It retains its natural aroma, strong flavor, and nutritious value, making it perfect for direct cooking, frying, or making traditional Indian pickles.",
      stock: 300,
      specifications: {
        "Brand": "Fortune",
        "Type": "Mustard Oil",
        "Quantity": "1 L",
        "Container Type": "Bottle",
        "Cold Pressed": "Yes",
        "Organic": "No"
      },
      images: [
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 13,
      category_id: 6,
      name: "Aashirvaad Shudh Chakki Whole Wheat Atta (10 kg)",
      price: 449.00,
      mrp: 499.00,
      rating: 4.5,
      rating_count: 67120,
      review_count: 4210,
      description: "Aashirvaad Whole Wheat Atta is made from superior-quality grains harvested from the golden fields of India. It is ground through a traditional stone-chakki process to lock in all nutrients, producing exceptionally soft and tasty rotis.",
      stock: 150,
      specifications: {
        "Brand": "Aashirvaad",
        "Type": "Whole Wheat Atta",
        "Quantity": "10 kg",
        "Form Factor": "Powdered",
        "Container Type": "Bag"
      },
      images: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 14,
      category_id: 1,
      name: "Google Pixel 8 Pro 5G (Bay, 128 GB)",
      price: 83999.00,
      mrp: 106999.00,
      rating: 4.5,
      rating_count: 3988,
      review_count: 286,
      description: "Google Pixel 8 Pro brings powerful AI photo tools, a brilliant Super Actua display, clean Android experience, and a pro-grade triple camera system designed for crisp shots in every light.",
      stock: 22,
      specifications: {
        "Brand": "Google",
        "Model Name": "Pixel 8 Pro",
        "Storage": "128 GB",
        "RAM": "12 GB",
        "Display": "6.7 inch LTPO OLED",
        "Camera": "50MP + 48MP + 48MP",
        "Processor": "Google Tensor G3"
      },
      images: [
        "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 15,
      category_id: 1,
      name: "Motorola Edge 50 Pro 5G (Luxe Lavender, 256 GB)",
      price: 31999.00,
      mrp: 41999.00,
      rating: 4.4,
      rating_count: 7420,
      review_count: 510,
      description: "A sleek phone with a vibrant curved pOLED display, fast charging, premium finish, and dependable everyday performance for multitasking, photos, and entertainment.",
      stock: 64,
      specifications: {
        "Brand": "Motorola",
        "Storage": "256 GB",
        "RAM": "8 GB",
        "Display": "6.7 inch pOLED",
        "Battery": "4500 mAh",
        "Charging": "125W TurboPower"
      },
      images: [
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 16,
      category_id: 2,
      name: "ASUS TUF Gaming F15 Intel Core i7 RTX 4060 Laptop",
      price: 92990.00,
      mrp: 119990.00,
      rating: 4.4,
      rating_count: 2860,
      review_count: 236,
      description: "Built for gaming and creative workloads with a high-refresh display, NVIDIA RTX graphics, military-grade durability, and efficient cooling for long sessions.",
      stock: 18,
      specifications: {
        "Brand": "ASUS",
        "Processor": "Intel Core i7",
        "RAM": "16 GB",
        "Storage": "1 TB SSD",
        "Graphics": "NVIDIA RTX 4060",
        "Display": "15.6 inch 144Hz"
      },
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 17,
      category_id: 2,
      name: "boAt Airdopes 141 Bluetooth Truly Wireless Earbuds",
      price: 1299.00,
      mrp: 4490.00,
      rating: 4.1,
      rating_count: 98230,
      review_count: 8120,
      description: "Compact earbuds with punchy sound, long battery life, low-latency gaming mode, touch controls, and a lightweight charging case for daily use.",
      stock: 220,
      specifications: {
        "Brand": "boAt",
        "Type": "True Wireless",
        "Playback": "Up to 42 Hours",
        "Bluetooth": "5.1",
        "Water Resistance": "IPX4",
        "Mic": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 18,
      category_id: 2,
      name: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
      price: 38999.00,
      mrp: 47995.00,
      rating: 4.5,
      rating_count: 11480,
      review_count: 940,
      description: "A beginner-friendly DSLR with a 24.1MP sensor, Wi-Fi connectivity, optical viewfinder, and versatile kit lens for portraits, travel, and everyday photography.",
      stock: 26,
      specifications: {
        "Brand": "Canon",
        "Sensor": "24.1 MP APS-C",
        "Lens": "18-55mm",
        "Connectivity": "Wi-Fi",
        "Video": "Full HD",
        "Ideal For": "Beginners"
      },
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 19,
      category_id: 3,
      name: "Levi's Men Slim Mid Rise Blue Jeans",
      price: 2299.00,
      mrp: 3999.00,
      rating: 4.2,
      rating_count: 8620,
      review_count: 612,
      description: "Classic slim-fit jeans with comfortable stretch fabric, clean styling, and a versatile blue wash that pairs easily with shirts, polos, and sneakers.",
      stock: 85,
      specifications: {
        "Brand": "Levi's",
        "Fit": "Slim",
        "Fabric": "Cotton Blend",
        "Rise": "Mid Rise",
        "Color": "Blue",
        "Closure": "Button and Zip"
      },
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 20,
      category_id: 3,
      name: "Fastrack Analog Black Dial Men's Watch",
      price: 1495.00,
      mrp: 2495.00,
      rating: 4.3,
      rating_count: 18790,
      review_count: 1322,
      description: "A sharp everyday watch with a minimal black dial, durable strap, quartz movement, and a confident design for casual and semi-formal outfits.",
      stock: 110,
      specifications: {
        "Brand": "Fastrack",
        "Display": "Analog",
        "Dial Color": "Black",
        "Strap": "Leather",
        "Water Resistant": "Yes",
        "Occasion": "Casual"
      },
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 21,
      category_id: 3,
      name: "Lavie Women's Tote Handbag",
      price: 1899.00,
      mrp: 4299.00,
      rating: 4.1,
      rating_count: 6950,
      review_count: 488,
      description: "A spacious tote handbag with refined texture, comfortable handles, secure zip closure, and enough room for daily office and travel essentials.",
      stock: 70,
      specifications: {
        "Brand": "Lavie",
        "Type": "Tote",
        "Material": "Synthetic Leather",
        "Closure": "Zip",
        "Compartments": "3",
        "Ideal For": "Women"
      },
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 22,
      category_id: 4,
      name: "Wakefit Orthopedic Memory Foam Mattress Queen Size",
      price: 8999.00,
      mrp: 15999.00,
      rating: 4.5,
      rating_count: 22450,
      review_count: 2104,
      description: "A supportive orthopedic mattress with pressure-relieving memory foam, breathable fabric, and balanced firmness for comfortable sleep and better posture.",
      stock: 35,
      specifications: {
        "Brand": "Wakefit",
        "Size": "Queen",
        "Material": "Memory Foam",
        "Firmness": "Medium Firm",
        "Thickness": "8 inch",
        "Warranty": "10 Years"
      },
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 23,
      category_id: 4,
      name: "Nilkamal Leo Engineered Wood Coffee Table",
      price: 2499.00,
      mrp: 4999.00,
      rating: 4.0,
      rating_count: 4620,
      review_count: 310,
      description: "A clean modern coffee table with storage shelf, smooth finish, and compact proportions that work beautifully in apartments and living rooms.",
      stock: 45,
      specifications: {
        "Brand": "Nilkamal",
        "Material": "Engineered Wood",
        "Finish": "Walnut",
        "Storage": "Open Shelf",
        "Assembly": "Required",
        "Shape": "Rectangle"
      },
      images: [
        "https://images.unsplash.com/photo-1532372320978-9d4d603bc2c8?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 24,
      category_id: 5,
      name: "Dyson V8 Absolute Cord-Free Vacuum Cleaner",
      price: 29900.00,
      mrp: 39900.00,
      rating: 4.6,
      rating_count: 3240,
      review_count: 276,
      description: "Powerful cord-free cleaning with multiple attachments, strong suction, HEPA filtration, and a lightweight design for floors, sofas, corners, and cars.",
      stock: 20,
      specifications: {
        "Brand": "Dyson",
        "Type": "Cordless Vacuum",
        "Runtime": "Up to 40 mins",
        "Filtration": "HEPA",
        "Ideal For": "Home and Car",
        "Warranty": "2 Years"
      },
      images: [
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 25,
      category_id: 5,
      name: "Philips Digital Air Fryer with Rapid Air Technology",
      price: 8999.00,
      mrp: 12995.00,
      rating: 4.4,
      rating_count: 9340,
      review_count: 780,
      description: "Cook crispy snacks with less oil using rapid air technology, adjustable temperature, timer control, and dishwasher-safe basket for easy cleaning.",
      stock: 55,
      specifications: {
        "Brand": "Philips",
        "Capacity": "4.1 L",
        "Power": "1400 W",
        "Controls": "Digital",
        "Technology": "Rapid Air",
        "Color": "Black"
      },
      images: [
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 26,
      category_id: 5,
      name: "Havells Instanio 3 L Instant Water Geyser",
      price: 3199.00,
      mrp: 5490.00,
      rating: 4.2,
      rating_count: 11820,
      review_count: 920,
      description: "A compact instant geyser with color-changing LED indicator, stainless steel tank, safety valve, and fast heating for bathrooms and kitchens.",
      stock: 74,
      specifications: {
        "Brand": "Havells",
        "Capacity": "3 L",
        "Type": "Instant",
        "Power": "3000 W",
        "Tank": "Stainless Steel",
        "Mount Type": "Vertical"
      },
      images: [
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 27,
      category_id: 6,
      name: "Tata Sampann Toor Dal Unpolished (1 kg)",
      price: 189.00,
      mrp: 235.00,
      rating: 4.6,
      rating_count: 38120,
      review_count: 2108,
      description: "Protein-rich unpolished toor dal with natural goodness retained, suitable for everyday dals, sambhar, khichdi, and traditional Indian meals.",
      stock: 260,
      specifications: {
        "Brand": "Tata Sampann",
        "Type": "Toor Dal",
        "Quantity": "1 kg",
        "Polished": "No",
        "Protein Source": "Yes",
        "Container": "Pouch"
      },
      images: [
        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 28,
      category_id: 6,
      name: "Nescafe Classic Instant Coffee Jar (200 g)",
      price: 589.00,
      mrp: 699.00,
      rating: 4.5,
      rating_count: 24110,
      review_count: 1705,
      description: "Rich aromatic instant coffee made from carefully selected beans, perfect for hot coffee, cold coffee, desserts, and everyday refreshment.",
      stock: 180,
      specifications: {
        "Brand": "Nescafe",
        "Type": "Instant Coffee",
        "Quantity": "200 g",
        "Container": "Glass Jar",
        "Flavor": "Classic",
        "Vegetarian": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 29,
      category_id: 2,
      name: "JBL Flip 6 Portable Waterproof Bluetooth Speaker",
      price: 8999.00,
      mrp: 14999.00,
      rating: 4.5,
      rating_count: 16480,
      review_count: 1280,
      description: "A rugged waterproof speaker with powerful JBL Original Pro Sound, deep bass, 12-hour playback, and a portable design for parties, travel, and outdoor fun.",
      stock: 90,
      specifications: {
        "Brand": "JBL",
        "Type": "Bluetooth Speaker",
        "Battery": "12 Hours",
        "Waterproof": "IP67",
        "Connectivity": "Bluetooth 5.1",
        "Output": "30 W"
      },
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 30,
      category_id: 1,
      name: "realme Narzo 70 Pro 5G (Glass Green, 128 GB)",
      price: 18999.00,
      mrp: 24999.00,
      rating: 4.3,
      rating_count: 15240,
      review_count: 1090,
      description: "A value-packed 5G phone with a smooth AMOLED display, strong Sony camera sensor, fast charging, and a stylish glass finish for daily power users.",
      stock: 130,
      specifications: {
        "Brand": "realme",
        "Storage": "128 GB",
        "RAM": "8 GB",
        "Display": "6.67 inch AMOLED",
        "Camera": "50MP Sony OIS",
        "Battery": "5000 mAh"
      },
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598965402089-897ce52e8355?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 31,
      category_id: 7,
      name: "Lakme Absolute Matte Melt Liquid Lip Color",
      price: 499.00,
      mrp: 800.00,
      rating: 4.2,
      rating_count: 18420,
      review_count: 1390,
      description: "A lightweight matte lip color with rich pigment, comfortable wear, and a smooth finish for office, college, parties, and everyday touch-ups.",
      stock: 140,
      specifications: {
        "Brand": "Lakme",
        "Type": "Liquid Lipstick",
        "Finish": "Matte",
        "Shade": "Red Smoke",
        "Quantity": "6 ml",
        "Ideal For": "Women"
      },
      images: [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 32,
      category_id: 7,
      name: "Minimalist SPF 50 PA++++ Sunscreen Cream",
      price: 399.00,
      mrp: 599.00,
      rating: 4.4,
      rating_count: 28610,
      review_count: 2415,
      description: "A daily sunscreen with high UV protection, lightweight texture, and a non-sticky feel that suits regular outdoor and commute use.",
      stock: 210,
      specifications: {
        "Brand": "Minimalist",
        "SPF": "50 PA++++",
        "Skin Type": "All Skin Types",
        "Quantity": "50 g",
        "Form": "Cream",
        "Paraben Free": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 33,
      category_id: 8,
      name: "Prestige Omega Deluxe Granite Non-Stick Cookware Set",
      price: 2199.00,
      mrp: 4495.00,
      rating: 4.3,
      rating_count: 12340,
      review_count: 980,
      description: "A practical cookware set with non-stick coating, sturdy handles, and everyday pans for breakfast, curries, snacks, and quick family cooking.",
      stock: 82,
      specifications: {
        "Brand": "Prestige",
        "Material": "Aluminium",
        "Coating": "Non-Stick Granite",
        "Pieces": "3",
        "Induction Bottom": "Yes",
        "Dishwasher Safe": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584990347449-a6d82bde2a9e?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 34,
      category_id: 8,
      name: "Solimo Microfiber Double Bedsheet with 2 Pillow Covers",
      price: 549.00,
      mrp: 1499.00,
      rating: 4.1,
      rating_count: 21460,
      review_count: 1622,
      description: "A soft printed bedsheet set with easy-care microfiber fabric, neat stitching, and a fresh pattern for regular bedroom use.",
      stock: 155,
      specifications: {
        "Brand": "Solimo",
        "Size": "Double",
        "Material": "Microfiber",
        "Thread Count": "144",
        "Set Contents": "1 Bedsheet, 2 Pillow Covers",
        "Machine Washable": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1616627451515-cbc80e9ece35?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 35,
      category_id: 9,
      name: "LEGO Classic Creative Bricks Building Set",
      price: 1899.00,
      mrp: 2499.00,
      rating: 4.7,
      rating_count: 9680,
      review_count: 840,
      description: "A colorful building set that encourages creative play, problem solving, and open-ended construction for kids and family activity time.",
      stock: 64,
      specifications: {
        "Brand": "LEGO",
        "Type": "Building Blocks",
        "Age Group": "4+ Years",
        "Material": "Plastic",
        "Pieces": "484",
        "Battery Required": "No"
      },
      images: [
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 36,
      category_id: 9,
      name: "Hot Wheels 5-Car Gift Pack",
      price: 549.00,
      mrp: 799.00,
      rating: 4.5,
      rating_count: 15120,
      review_count: 1112,
      description: "A collectible toy car pack with bright designs, smooth rolling wheels, and durable build for racing, pretend play, and gifting.",
      stock: 132,
      specifications: {
        "Brand": "Hot Wheels",
        "Type": "Toy Cars",
        "Age Group": "3+ Years",
        "Pack Of": "5",
        "Material": "Die-Cast Metal",
        "Battery Required": "No"
      },
      images: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 37,
      category_id: 10,
      name: "Bosch Car Vacuum Cleaner with HEPA Filter",
      price: 2499.00,
      mrp: 3999.00,
      rating: 4.2,
      rating_count: 7210,
      review_count: 566,
      description: "A compact car vacuum cleaner for seats, mats, boot spaces, and small dust pockets, with attachments that help reach narrow corners.",
      stock: 48,
      specifications: {
        "Brand": "Bosch",
        "Type": "Car Vacuum",
        "Power": "150 W",
        "Filter": "HEPA",
        "Cord Length": "4 m",
        "Warranty": "1 Year"
      },
      images: [
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 38,
      category_id: 10,
      name: "Bergmann Typhoon Digital Tyre Inflator",
      price: 1899.00,
      mrp: 2999.00,
      rating: 4.4,
      rating_count: 10450,
      review_count: 880,
      description: "A portable digital inflator with auto cut-off, pressure display, and emergency light for cars, bikes, footballs, and travel kits.",
      stock: 58,
      specifications: {
        "Brand": "Bergmann",
        "Type": "Tyre Inflator",
        "Display": "Digital",
        "Auto Cut-Off": "Yes",
        "Power Source": "12V DC",
        "Max Pressure": "150 PSI"
      },
      images: [
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 39,
      category_id: 11,
      name: "Vega Bolt Bunny ISI Certified Full Face Helmet",
      price: 1499.00,
      mrp: 1998.00,
      rating: 4.3,
      rating_count: 18990,
      review_count: 1456,
      description: "A full-face helmet with clear visor, comfortable padding, secure strap, and ISI certification for daily two-wheeler rides.",
      stock: 96,
      specifications: {
        "Brand": "Vega",
        "Type": "Full Face Helmet",
        "Certification": "ISI",
        "Visor": "Clear",
        "Size": "M",
        "Ideal For": "Men and Women"
      },
      images: [
        "https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 40,
      category_id: 11,
      name: "Steelbird Two Wheeler Riding Gloves",
      price: 699.00,
      mrp: 1299.00,
      rating: 4.1,
      rating_count: 6420,
      review_count: 410,
      description: "Comfortable riding gloves with padded palm, breathable fabric, and firm grip for city rides, weekend trips, and scooter commutes.",
      stock: 125,
      specifications: {
        "Brand": "Steelbird",
        "Type": "Riding Gloves",
        "Material": "Synthetic Leather",
        "Size": "L",
        "Grip": "Anti-Slip",
        "Washable": "Yes"
      },
      images: [
        "https://images.unsplash.com/photo-1611241443322-78c9a3ffbd3c?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 41,
      category_id: 12,
      name: "Yonex Nanoray Light 18i Badminton Racquet",
      price: 1699.00,
      mrp: 2790.00,
      rating: 4.4,
      rating_count: 17450,
      review_count: 1320,
      description: "A lightweight badminton racquet with quick swing speed, comfortable grip, and balanced control for beginners and regular players.",
      stock: 73,
      specifications: {
        "Brand": "Yonex",
        "Sport": "Badminton",
        "Weight": "77 g",
        "Grip Size": "G4",
        "Material": "Graphite",
        "Cover": "Full Cover"
      },
      images: [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613918431703-aa50889e3be1?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 42,
      category_id: 12,
      name: "Nivia Storm Football Size 5",
      price: 599.00,
      mrp: 999.00,
      rating: 4.2,
      rating_count: 13880,
      review_count: 1042,
      description: "A durable size 5 football with machine-stitched panels, strong bounce, and reliable grip for turf, ground, and school play.",
      stock: 116,
      specifications: {
        "Brand": "Nivia",
        "Sport": "Football",
        "Size": "5",
        "Material": "PVC",
        "Stitching": "Machine Stitched",
        "Ideal For": "Training"
      },
      images: [
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 43,
      category_id: 13,
      name: "Atomic Habits by James Clear Paperback",
      price: 399.00,
      mrp: 799.00,
      rating: 4.6,
      rating_count: 53120,
      review_count: 4960,
      description: "A popular self-improvement book about building better habits through small systems, practical routines, and clear behavior cues.",
      stock: 190,
      specifications: {
        "Author": "James Clear",
        "Language": "English",
        "Binding": "Paperback",
        "Genre": "Self Help",
        "Pages": "320",
        "Publisher": "Random House"
      },
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: 44,
      category_id: 13,
      name: "Classmate Long Notebook Pack of 6",
      price: 279.00,
      mrp: 360.00,
      rating: 4.5,
      rating_count: 24680,
      review_count: 1880,
      description: "A pack of ruled long notebooks with smooth paper, strong binding, and enough pages for school, college, office, and exam notes.",
      stock: 240,
      specifications: {
        "Brand": "Classmate",
        "Type": "Notebook",
        "Pages": "172 Each",
        "Ruling": "Single Line",
        "Pack Of": "6",
        "Paper Size": "Long"
      },
      images: [
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=600&auto=format&fit=crop"
      ]
    }
  ]
};

module.exports = seedData;
