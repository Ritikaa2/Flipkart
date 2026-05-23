import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const fallbackProducts = [
  ['KOTTY Women Regular Fit Black Trousers', 297, 1999, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500&auto=format&fit=crop', 19],
  ['Ankit fashion Women Straight Pants', 350, 1999, 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=500&auto=format&fit=crop', 19],
  ['KOTTY Women Regular Fit Beige Trousers', 362, 1999, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=500&auto=format&fit=crop', 19],
  ['NEYS A Women Regular Fit Black Pants', 362, 999, 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?q=80&w=500&auto=format&fit=crop', 19],
  ['OPPO A6x 4G Mobile', 11589, 12999, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop', 30],
  ['Vivo T5x 5G Cyber Green', 20499, 22999, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=500&auto=format&fit=crop', 15],
  ['Roadster Men Printed T-shirt', 575, 1999, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=500&auto=format&fit=crop', 6],
  ['Women Embroidered Shirt', 330, 1499, 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=500&auto=format&fit=crop', 6],
  ['Apple iPad 128 GB ROM', 34890, 49900, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop', 4],
  ['Mens Cargo Style Pants', 686, 1990, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop', 19],
  ['Women Regular Fit Striped Shirt', 338, 449, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=500&auto=format&fit=crop', 6],
  ['Mini Jungle Animals Toy Set', 118, 999, 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=500&auto=format&fit=crop', 17],
  ['Foldable Storage Rack', 299, 999, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop', 23],
  ['Shop Now Black Dress', 699, 1999, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=500&auto=format&fit=crop', 21],
  ['Realme Buds Wireless', 599, 1999, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=500&auto=format&fit=crop', 17],
  ['Vegetable Chopper', 785, 1499, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=500&auto=format&fit=crop', 25],
  ['Wooden Alphabet Toy', 262, 999, 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=500&auto=format&fit=crop', 23],
  ['Hand Fan Rechargeable', 188, 799, 'https://images.unsplash.com/photo-1620297949358-4d130a96b721?q=80&w=500&auto=format&fit=crop', 26],
  ['Trendy Sling Bag', 298, 999, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop', 21],
  ['Racket Set for Kids', 308, 999, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=500&auto=format&fit=crop', 7]
].map(([name, price, mrp, image_url, product_id], index) => ({
  id: `fallback-${index}`,
  product_id,
  name,
  price,
  mrp,
  image_url,
  rating: index % 3 === 0 ? 4.1 : index % 3 === 1 ? 4.3 : 4.5,
  rating_count: 31 + index * 19
}));

const heroCards = [
  { image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=900&auto=format&fit=crop', title: 'edge 70 fusion', text: 'From Rs. 24,999*' },
  { image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=900&auto=format&fit=crop', title: 'Nova 2 5G', text: 'From Rs. 10,999*' },
  { image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=900&auto=format&fit=crop', title: 'Introducing Vibe 2', text: 'From Rs. 9,499*' },
  { image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=900&auto=format&fit=crop', title: 'Limited time deals', text: 'Soundbars from Rs. 3,799' },
  { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop', title: 'Simple to ride', text: 'Up to 70% Off' },
  { image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=900&auto=format&fit=crop', title: 'Chill faster', text: 'From Rs. 28,990*' }
];

const shortcutItems = [
  ['Grocery', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=180&auto=format&fit=crop'],
  ['For GenZ', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=180&auto=format&fit=crop'],
  ['Flipkart', 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=180&auto=format&fit=crop'],
  ['Originals', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=180&auto=format&fit=crop'],
  ['Gift Cards', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=180&auto=format&fit=crop'],
  ['Sell Phone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=180&auto=format&fit=crop'],
  ['BLACK', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=180&auto=format&fit=crop'],
  ['Super C...', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=180&auto=format&fit=crop'],
  ['Next-Gen', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=180&auto=format&fit=crop']
];

const brandCards = [
  ['Sturdy & stylish', 'Min. 75% Off', 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?q=80&w=400&auto=format&fit=crop'],
  ['1.39" display', 'Min. 70% Off', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop'],
  ['Built for speed', 'Min. 55% Off', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop'],
  ["Today's special deal", 'Up to 80% Off', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=400&auto=format&fit=crop'],
  ['Track your fitness', 'Up to 90% Off', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400&auto=format&fit=crop'],
  ['Biggest price drop', 'Up to 90% Off', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=400&auto=format&fit=crop']
].map(([title, offer, image]) => ({ title, offer, image }));

const text = (value) => String(value || '').trim().toLowerCase();
const categoryAliases = {
  'mobiles & accessories': 'mobiles',
  'home & furniture': 'furniture',
  toys: 'toys',
  auto: 'auto',
  'two wheelers': 'two wheelers',
  sports: 'sports'
};

const normalizedCategory = (value) => categoryAliases[text(value)] || text(value);
const cardImage = (item) => {
  const gallery = [item?.image_url, ...(item?.images || [])].filter(Boolean);
  const uniqueGallery = [...new Set(gallery)];
  if (!uniqueGallery.length) return '/favicon.svg';
  return uniqueGallery[Math.abs(Number(item?.id || item?.product_id || 0)) % uniqueGallery.length];
};

const categoryPages = {
  Mobiles: {
    hero: [
      ['vivo T5x 5G', 'From Rs. 20,999*', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=900&auto=format&fit=crop'],
      ['edge 70 fusion', 'From Rs. 24,999*', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=900&auto=format&fit=crop'],
      ['Ai+ Nova 2 5G', 'From Rs. 10,999*', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['iPhone', 'vivo', 'realme', 'POCO', 'Alt+', 'Google', 'Tecno', 'HMD', 'motorola', 'Samsung', 'OPPO', 'Nothing'],
    products: [
      ['OPPO A6x 4G', 11589, 12999, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop', 30],
      ['G Five A99 Mini Keypad', 845, 999, 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=500&auto=format&fit=crop', 3],
      ['vivo T5x 5G', 20499, 22999, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=500&auto=format&fit=crop', 15],
      ['realme C67 5G', 16190, 16999, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop', 30]
    ]
  },
  Beauty: {
    hero: [
      ['Afnan perfumes', 'Up to 45% Off', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=900&auto=format&fit=crop'],
      ['Hira perfumes', 'Up to 60% Off', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=900&auto=format&fit=crop'],
      ['Sale is live', 'From Rs. 22', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Skincare', 'Afnan', 'Hair care', 'Top 25 deals', 'Makeup', 'Grooming', 'Fragrances', 'Premium', 'Personal care', 'Derma'],
    products: [
      ['Olay Serum', 799, 1599, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop', 28],
      ['Dot & Key Sunscreen', 349, 599, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=500&auto=format&fit=crop', 28],
      ['Maybelline Foundation', 499, 799, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop', 28],
      ['Ponds Hydra Cream', 299, 499, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop', 28]
    ]
  },
  Home: {
    hero: [
      ['Maha Home Sale', 'Home & Furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop'],
      ['GST benefits', 'Maximise your savings', 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=900&auto=format&fit=crop'],
      ['Brand paglus', 'Up to 70% Off', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Cookware', 'Lighting', 'Containers', 'Drinkware', 'Bathroom', 'Mattress', 'Wallpaper', 'Furnishing', 'Hardware', 'Covers', 'Decor', 'Bedsheets'],
    products: [
      ['Cookware Set', 799, 1999, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=500&auto=format&fit=crop', 25],
      ['Designer Lamp', 499, 1499, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500&auto=format&fit=crop', 23],
      ['Storage Containers', 299, 999, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop', 23],
      ['Sofa Furnishing', 1299, 3999, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500&auto=format&fit=crop', 8]
    ]
  },
  Fashion: {
    hero: [
      ['Back to Campus', 'Min. 60% Off', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop'],
      ['Denim Fest', 'Every budget', 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=900&auto=format&fit=crop'],
      ['Spring picks', 'Fresh styles', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['College Ready', 'Tshirts', 'Jeans', 'Kurta Sets', 'Formal Wear', 'Sunglasses', 'Backpacks', 'Kids clothing', 'Sneakers', 'Watches'],
    products: fallbackProducts.slice(0, 12).map((item) => [item.name, item.price, item.mrp, item.image_url, item.product_id])
  },
  Electronics: {
    hero: [
      ['Laptops & audio', 'Top tech deals', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=900&auto=format&fit=crop'],
      ['Noise cancelling', 'From Rs. 1,299', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop'],
      ['Cameras & speakers', 'Save more today', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Laptops', 'Earbuds', 'Speakers', 'Camera', 'Headphones', 'Tablets', 'Gaming', 'Storage', 'Accessories', 'Smart Watch'],
    products: fallbackProducts.slice(8, 18).map((item) => [item.name, item.price, item.mrp, item.image_url, item.product_id])
  },
  Appliances: {
    hero: [
      ['Appliance sale', 'Up to 45% Off', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=900&auto=format&fit=crop'],
      ['Kitchen helpers', 'Cook smarter', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=900&auto=format&fit=crop'],
      ['Home cleaning', 'Cordless picks', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Washing', 'Refrigerator', 'Air Fryer', 'Vacuum', 'Geyser', 'Mixer', 'Microwave', 'Kitchen', 'Cooling', 'Laundry'],
    products: fallbackProducts.slice(12, 20).map((item) => [item.name, item.price, item.mrp, item.image_url, item.product_id])
  },
  Grocery: {
    hero: [
      ['Monthly staples', 'Fresh pantry deals', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=900&auto=format&fit=crop'],
      ['Breakfast basics', 'Everyday savings', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop'],
      ['Coffee & snacks', 'Stock up now', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Atta', 'Dal', 'Oil', 'Coffee', 'Rice', 'Snacks', 'Dry Fruits', 'Spices', 'Tea', 'Breakfast'],
    products: fallbackProducts.slice(0, 10).map((item) => [item.name, item.price, item.mrp, item.image_url, item.product_id])
  },
  Toys: {
    hero: [
      ['Creative play', 'Toys from Rs. 99', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=900&auto=format&fit=crop'],
      ['Building blocks', 'Learn while playing', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=900&auto=format&fit=crop'],
      ['Toy cars', 'Gift-ready picks', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Blocks', 'Toy Cars', 'Soft Toys', 'Puzzles', 'Board Games', 'Learning', 'Remote Toys', 'Outdoor', 'Baby Toys', 'Gifts'],
    products: [
      ['LEGO Classic Creative Bricks', 1899, 2499, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=500&auto=format&fit=crop', 35],
      ['Hot Wheels 5-Car Gift Pack', 549, 799, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=500&auto=format&fit=crop', 36],
      ['Mini Jungle Animals Toy Set', 118, 999, 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=500&auto=format&fit=crop', 35],
      ['Wooden Alphabet Toy', 262, 999, 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=500&auto=format&fit=crop', 36]
    ]
  },
  Auto: {
    hero: [
      ['Car care essentials', 'Up to 55% Off', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop'],
      ['Emergency tools', 'Drive ready', 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=900&auto=format&fit=crop'],
      ['Clean interiors', 'Daily car care', 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Vacuum', 'Inflator', 'Covers', 'Perfume', 'Cleaner', 'Tools', 'Lighting', 'Mats', 'Chargers', 'Polish'],
    products: [
      ['Bosch Car Vacuum Cleaner', 2499, 3999, 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=500&auto=format&fit=crop', 37],
      ['Digital Tyre Inflator', 1899, 2999, 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=500&auto=format&fit=crop', 38]
    ]
  },
  'Two Wheelers': {
    hero: [
      ['Ride safe', 'Helmets from Rs. 699', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900&auto=format&fit=crop'],
      ['Riding gear', 'Commute ready', 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=900&auto=format&fit=crop'],
      ['Bike essentials', 'Daily ride picks', 'https://images.unsplash.com/photo-1611241443322-78c9a3ffbd3c?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Helmets', 'Gloves', 'Covers', 'Cleaners', 'Locks', 'Mirrors', 'Jackets', 'Rain Gear', 'Lights', 'Mobile Holder'],
    products: [
      ['Vega Full Face Helmet', 1499, 1998, 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=500&auto=format&fit=crop', 39],
      ['Steelbird Riding Gloves', 699, 1299, 'https://images.unsplash.com/photo-1611241443322-78c9a3ffbd3c?q=80&w=500&auto=format&fit=crop', 40]
    ]
  },
  Sports: {
    hero: [
      ['Sports essentials', 'Up to 60% Off', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=900&auto=format&fit=crop'],
      ['Badminton picks', 'Lightweight racquets', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=900&auto=format&fit=crop'],
      ['Football training', 'Play every day', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Badminton', 'Football', 'Cricket', 'Fitness', 'Shoes', 'Yoga', 'Cycles', 'Swimming', 'Running', 'Outdoor'],
    products: [
      ['Yonex Badminton Racquet', 1699, 2790, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=500&auto=format&fit=crop', 41],
      ['Nivia Storm Football', 599, 999, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=500&auto=format&fit=crop', 42]
    ]
  },
  Books: {
    hero: [
      ['Books & stationery', 'Learning deals', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=900&auto=format&fit=crop'],
      ['Bestsellers', 'From Rs. 199', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=900&auto=format&fit=crop'],
      ['School supplies', 'Notebook packs', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Self Help', 'Fiction', 'Notebooks', 'Exam Prep', 'Pens', 'Kids Books', 'Business', 'Comics', 'Diaries', 'Art'],
    products: [
      ['Atomic Habits Paperback', 399, 799, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop', 43],
      ['Classmate Notebook Pack', 279, 360, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop', 44]
    ]
  },
  Furniture: {
    hero: [
      ['Furniture deals', 'Refresh your room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop'],
      ['Sleep better', 'Mattress offers', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=900&auto=format&fit=crop'],
      ['Work from home', 'Chairs & tables', 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['Beds', 'Chairs', 'Mattress', 'Tables', 'Sofas', 'Storage', 'Shoe Racks', 'Wardrobes', 'TV Units', 'Decor'],
    products: fallbackProducts.slice(12, 20).map((item) => [item.name, item.price, item.mrp, item.image_url, item.product_id])
  }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchMeta, setSearchMeta] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('category') || '';
  const searchQuery = params.get('search') || '';
  const pageConfig = categoryPages[selectedCategory] || categoryPages.Fashion;
  const categoryHeroCards = pageConfig.hero.map(([title, text, image]) => ({ title, text, image }));
  const heroPool = selectedCategory ? categoryHeroCards : heroCards;

  useEffect(() => {
    const query = [];
    if (selectedCategory) query.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (searchQuery) query.push(`search=${encodeURIComponent(searchQuery)}`);
    setIsLoading(true);
    api.get(`/products${query.length ? `?${query.join('&')}` : ''}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setSearchMeta({
          suggestion: res.data.suggestion || '',
          correctedQuery: res.data.correctedQuery || ''
        });
      })
      .catch((err) => console.error('Products fetch failed:', err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroPool.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroPool.length]);

  const productFeed = useMemo(() => {
    const real = products.map((item) => ({ ...item, id: Number(item.id) }));
    const fallbackList = pageConfig.products.map(([name, price, mrp, image_url, product_id], index) => ({
      id: `${selectedCategory || 'for-you'}-${index}`,
      product_id,
      name,
      price,
      mrp,
      image_url,
      rating: index % 2 ? 4.3 : 4.1,
      rating_count: 31 + index * 17
    }));

    const feed = real.length ? real : [...fallbackList, ...fallbackProducts];
    return Array.from({ length: 36 }, (_, index) => feed[index % feed.length]);
  }, [products, pageConfig, selectedCategory]);

  const openProduct = (item) => {
    const productId = Number(item?.product_id || item?.id);
    const hasRealId = Number.isInteger(productId) && productId > 0;

    if (hasRealId) {
      navigate(`/product/${productId}`);
      return;
    }

    const localMatch = products.find((product) => text(product.name) === text(item?.name));
    if (localMatch?.id) {
      navigate(`/product/${localMatch.id}`);
      return;
    }

    if (!item?.name) return;
  };

  const ProductTile = ({ item, tall = false }) => (
    <button className={`fk-feed-card ${tall ? 'is-tall' : ''}`} onClick={() => openProduct(item)}>
      <div className="fk-feed-img">
        <img src={cardImage(item)} alt={item.name} loading="lazy" />
        <span>{item.rating || 4.2} * <small>({item.rating_count || 31})</small></span>
      </div>
      <b>{item.name}</b>
      <p><del>Rs. {(item.mrp || 999).toLocaleString()}</del> Rs. {(item.price || 299).toLocaleString()}</p>
      <strong>Rs. {Math.max(Math.round((item.price || 299) * 0.95), 99).toLocaleString()} with Bank offer</strong>
    </button>
  );

  const visibleHeroCards = [0, 1, 2].map((offset) => heroPool[(heroIndex + offset) % heroPool.length]);

  if (searchQuery) {
    return (
      <SearchResults
        query={searchQuery}
        meta={searchMeta}
        products={products}
        loading={isLoading}
        openProduct={openProduct}
      />
    );
  }

  return (
    <div className="fk-home">
      <section className="fk-auto-hero">
        {visibleHeroCards.map((card, index) => (
          <button
            key={`${card.title}-${index}`}
            className={`fk-auto-hero-card hero-card-${index + 1}`}
            onClick={() => navigate(index === 0 ? '/?category=Mobiles' : '/?category=Electronics')}
          >
            <img src={card.image} alt={card.title} loading={index === 0 ? 'eager' : 'lazy'} />
            <span>Back to Campus</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <small>AD</small>
          </button>
        ))}
      </section>
      <div className="fk-auto-dots">
        {heroCards.map((card, index) => (
          <button
            key={card.title}
            className={index === heroIndex ? 'active' : ''}
            onClick={() => setHeroIndex(index)}
            aria-label={`Show banner ${index + 1}`}
          />
        ))}
      </div>

      <section className="fk-category-tiles-row">
        {pageConfig.shortcuts.map((label, index) => (
          <button key={label}>
            <img src={cardImage(productFeed[index] || fallbackProducts[index % fallbackProducts.length])} alt={label} loading="lazy" />
            <span>{label}</span>
          </button>
        ))}
      </section>

      {selectedCategory === 'Mobiles' && (
        <section className="fk-bank-offer-strip">
          <b>HDFC BANK</b>
          <span>Up to 10% Instant Discount*</span>
        </section>
      )}

      <section className="fk-shortcuts">
        {shortcutItems.map(([label, image]) => (
          <button key={label}>
            <img src={image} alt={label} loading="lazy" />
            <span>{label}</span>
          </button>
        ))}
      </section>

      <section className="fk-grab">
        <h2>Grab or gone</h2>
        <div>
          {productFeed.slice(12, 16).map((item, index) => (
            <button key={`grab-${index}-${item.id}`} onClick={() => openProduct(item)}>
              <img src={cardImage(item)} alt={item.name} loading="lazy" />
              <span>{index === 1 ? 'Shop Now!' : item.name}</span>
              <b>{index === 2 ? 'Min 50% Off' : `From Rs. ${item.price}`}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="fk-feed-grid">
        {productFeed.slice(16, 28).map((item, index) => (
          <ProductTile key={`mid-${index}-${item.id}`} item={item} tall={index % 3 !== 0} />
        ))}
      </section>

      <section className="fk-exact-section">
        <img src="/flipkart-home/everybody-list.png" alt="On everybody's list" loading="lazy" />
      </section>

      <section className="fk-exact-section fk-grwm-banner">
        <img src="/flipkart-home/grwm-banner.png" alt="GRWM sale extra discounts" loading="lazy" />
      </section>

      <RowSection title="Suggested For You" items={productFeed.slice(4, 12)} openProduct={openProduct} />

      <section className="fk-brands-real">
        <h2>Brands in Spotlight</h2>
        <div>
          {brandCards.map((card) => (
            <button key={card.title}>
              <img src={card.image} alt={card.title} loading="lazy" />
              <strong>{card.offer}</strong>
              <span>{card.title}</span>
              <small>AD</small>
            </button>
          ))}
        </div>
      </section>

      <RowSection title="Suggested For You" items={productFeed.slice(20, 30)} openProduct={openProduct} />

      {isLoading && (
        <div className="fk-feed-loading">Loading more deals...</div>
      )}
    </div>
  );
};

const RowSection = ({ title, items, openProduct }) => (
  <section className="fk-suggested-real">
    <div className="fk-real-head">
      <h2>{title}</h2>
      <button>{'>'}</button>
    </div>
    <div className="fk-real-strip">
      {items.map((item, index) => (
        <button key={`${title}-${index}-${item.id}`} onClick={() => openProduct(item)}>
          <img src={cardImage(item)} alt={item.name} loading="lazy" />
          <span>{item.rating || 4.1} *</span>
          <b>{item.name}</b>
          <p><del>Rs. {(item.mrp || 999).toLocaleString()}</del> Rs. {(item.price || 299).toLocaleString()}</p>
          <strong>Rs. {Math.max(Math.round((item.price || 299) * 0.95), 99).toLocaleString()} with Bank offer</strong>
        </button>
      ))}
    </div>
  </section>
);

const SearchResults = ({ query, meta, products, loading, openProduct }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilters, setPriceFilters] = useState([]);
  const [ratingFilters, setRatingFilters] = useState([]);
  const [sortBy, setSortBy] = useState('Relevance');

  useEffect(() => {
    setSelectedCategories([]);
    setPriceFilters([]);
    setRatingFilters([]);
    setSortBy('Relevance');
  }, [query]);

  const categoryOptions = useMemo(() => {
    const names = [...new Set(products.map((item) => item.category_name).filter(Boolean))];
    return names.length ? names : ['Mobiles', 'Fashion', 'Electronics', 'Furniture', 'Toys', 'Auto', 'Two Wheelers', 'Sports'];
  }, [products]);

  const toggleValue = (setter, value) => {
    setter((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  };

  const filteredItems = useMemo(() => {
    let items = products.filter((item) => item?.id);

    if (selectedCategories.length) {
      const selected = selectedCategories.map(normalizedCategory);
      items = items.filter((item) => selected.includes(normalizedCategory(item.category_name)));
    }

    if (priceFilters.length) {
      items = items.filter((item) => {
        const price = Number(item.price || 0);
        return priceFilters.some((range) => {
          if (range === 'Under Rs. 1,000') return price < 1000;
          if (range === 'Rs. 1,000 - Rs. 10,000') return price >= 1000 && price <= 10000;
          if (range === 'Rs. 10,000 - Rs. 25,000') return price > 10000 && price <= 25000;
          return price > 25000;
        });
      });
    }

    if (ratingFilters.length) {
      const minRating = Math.max(...ratingFilters.map((value) => Number(value[0]) || 0));
      items = items.filter((item) => Number(item.rating || 0) >= minRating);
    }

    const sorted = [...items];
    if (sortBy === 'Popularity') sorted.sort((a, b) => Number(b.rating_count || 0) - Number(a.rating_count || 0));
    if (sortBy === 'Price -- Low to High') sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortBy === 'Price -- High to Low') sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sortBy === 'Newest First') sorted.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    return sorted;
  }, [products, selectedCategories, priceFilters, ratingFilters, sortBy]);

  const items = filteredItems;
  const count = items.length;
  const suggestion = meta?.correctedQuery || meta?.suggestion || '';
  const showSuggestion = suggestion && suggestion !== text(query);

  return (
    <main className="fk-search-page">
      <div className="fk-search-layout">
        <aside className="fk-search-filter">
          <div className="fk-search-filter-head">
            <h2>Filters</h2>
          </div>
          <FilterBlock title="Categories" options={categoryOptions} selected={selectedCategories} onToggle={(value) => toggleValue(setSelectedCategories, value)} />
          <FilterBlock title="Customer ratings" options={['4+ Ratings', '3+ Ratings']} selected={ratingFilters} onToggle={(value) => toggleValue(setRatingFilters, value)} />
          <FilterBlock title="Price" options={['Under Rs. 1,000', 'Rs. 1,000 - Rs. 10,000', 'Rs. 10,000 - Rs. 25,000', 'Rs. 25,000+']} selected={priceFilters} onToggle={(value) => toggleValue(setPriceFilters, value)} />
        </aside>

        <section className="fk-search-results">
          <div className="fk-search-head">
            <p>Home / Search</p>
            <h1>
              {loading ? 'Searching...' : count ? `Showing 1 - ${count} of ${count} results for "${meta?.correctedQuery || query}"` : `No results for "${query}"`}
            </h1>
            {showSuggestion && (
              <p className="fk-spell-suggestion">
                {meta?.correctedQuery ? 'Showing results for ' : 'Did you mean '}
                <button type="button">{suggestion}</button>
                {!meta?.correctedQuery && ' ?'}
              </p>
            )}
            <div className="fk-sort-row">
              {['Relevance', 'Popularity', 'Price -- Low to High', 'Price -- High to Low', 'Newest First'].map((label, index) => (
                <button key={label} className={sortBy === label ? 'active' : ''} onClick={() => setSortBy(label)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="fk-search-message">Loading matching products...</div>}

          {!loading && !count && (
            <div className="fk-search-empty">
              <h2>No product found</h2>
              <p>Try a smaller name like phone, jeans, laptop or watch.</p>
            </div>
          )}

          {!loading && items.map((item) => (
            <SearchItem key={item.id} item={item} onClick={() => openProduct(item)} />
          ))}
        </section>
      </div>
    </main>
  );
};

const FilterBlock = ({ title, options, selected, onToggle }) => (
  <div className="fk-filter-block">
    <h3>{title}</h3>
    <div>
      {options.map((option) => (
        <label key={option}>
          <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const SearchItem = ({ item, onClick }) => {
  const price = Number(item.price || 0);
  const mrp = Number(item.mrp || price);
  const off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const details = [
    item.category_name ? `Best match in ${item.category_name}` : '',
    item.stock ? `${item.stock} units available` : '',
    'Fast delivery with safe packaging',
    'Easy returns and trusted seller support'
  ].filter(Boolean);

  return (
    <button className="fk-search-item" onClick={onClick}>
      <div className="fk-search-photo">
        <img src={cardImage(item)} alt={item.name} loading="lazy" />
      </div>

      <div className="fk-search-copy">
        <h2>{item.name}</h2>
        <p>
          <span>{item.rating || 4.2} *</span>
          <small>{(item.rating_count || 1200).toLocaleString()} Ratings & Reviews</small>
        </p>
        <ul>
          {details.slice(0, 5).map((line) => <li key={line}>* {line}</li>)}
        </ul>
      </div>

      <div className="fk-search-price">
        <strong>Rs. {price.toLocaleString()}</strong>
        {mrp > price && (
          <p>
            <del>Rs. {mrp.toLocaleString()}</del>
            <span>{off}% off</span>
          </p>
        )}
        <em>Bank Offer</em>
        <small>Upto Rs. 5,000 off on exchange</small>
      </div>
    </button>
  );
};

export default Home;
