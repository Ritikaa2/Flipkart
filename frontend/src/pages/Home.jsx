import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const fallbackProducts = [
  ['KOTTY Women Regular Fit Black Trousers', 297, 1999, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500&auto=format&fit=crop'],
  ['Ankit fashion Women Straight Pants', 350, 1999, 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=500&auto=format&fit=crop'],
  ['KOTTY Women Regular Fit Beige Trousers', 362, 1999, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=500&auto=format&fit=crop'],
  ['NEYS A Women Regular Fit Black Pants', 362, 999, 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?q=80&w=500&auto=format&fit=crop'],
  ['OPPO A6x 4G Mobile', 11589, 12999, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop'],
  ['Vivo T5x 5G Cyber Green', 20499, 22999, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=500&auto=format&fit=crop'],
  ['Roadster Men Printed T-shirt', 575, 1999, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=500&auto=format&fit=crop'],
  ['Women Embroidered Shirt', 330, 1499, 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=500&auto=format&fit=crop'],
  ['Apple iPad 128 GB ROM', 34890, 49900, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop'],
  ['Mens Cargo Style Pants', 686, 1990, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop'],
  ['Women Regular Fit Striped Shirt', 338, 449, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=500&auto=format&fit=crop'],
  ['Mini Jungle Animals Toy Set', 118, 999, 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=500&auto=format&fit=crop'],
  ['Foldable Storage Rack', 299, 999, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop'],
  ['Shop Now Black Dress', 699, 1999, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=500&auto=format&fit=crop'],
  ['Realme Buds Wireless', 599, 1999, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=500&auto=format&fit=crop'],
  ['Vegetable Chopper', 785, 1499, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=500&auto=format&fit=crop'],
  ['Wooden Alphabet Toy', 262, 999, 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=500&auto=format&fit=crop'],
  ['Hand Fan Rechargeable', 188, 799, 'https://images.unsplash.com/photo-1620297949358-4d130a96b721?q=80&w=500&auto=format&fit=crop'],
  ['Trendy Sling Bag', 298, 999, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop'],
  ['Racket Set for Kids', 308, 999, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=500&auto=format&fit=crop']
].map(([name, price, mrp, image_url], index) => ({
  id: `fallback-${index}`,
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

const categoryPages = {
  Mobiles: {
    hero: [
      ['vivo T5x 5G', 'From Rs. 20,999*', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=900&auto=format&fit=crop'],
      ['edge 70 fusion', 'From Rs. 24,999*', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=900&auto=format&fit=crop'],
      ['Ai+ Nova 2 5G', 'From Rs. 10,999*', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['iPhone', 'vivo', 'realme', 'POCO', 'Alt+', 'Google', 'Tecno', 'HMD', 'motorola', 'Samsung', 'OPPO', 'Nothing'],
    products: [
      ['OPPO A6x 4G', 11589, 12999, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop'],
      ['G Five A99 Mini Keypad', 845, 999, 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=500&auto=format&fit=crop'],
      ['vivo T5x 5G', 20499, 22999, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=500&auto=format&fit=crop'],
      ['realme C67 5G', 16190, 16999, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop']
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
      ['Olay Serum', 799, 1599, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop'],
      ['Dot & Key Sunscreen', 349, 599, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=500&auto=format&fit=crop'],
      ['Maybelline Foundation', 499, 799, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop'],
      ['Ponds Hydra Cream', 299, 499, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop']
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
      ['Cookware Set', 799, 1999, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=500&auto=format&fit=crop'],
      ['Designer Lamp', 499, 1499, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500&auto=format&fit=crop'],
      ['Storage Containers', 299, 999, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop'],
      ['Sofa Furnishing', 1299, 3999, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500&auto=format&fit=crop']
    ]
  },
  Fashion: {
    hero: [
      ['Back to Campus', 'Min. 60% Off', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop'],
      ['Denim Fest', 'Every budget', 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=900&auto=format&fit=crop'],
      ['Spring picks', 'Fresh styles', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop']
    ],
    shortcuts: ['College Ready', 'Tshirts', 'Jeans', 'Kurta Sets', 'Formal Wear', 'Sunglasses', 'Backpacks', 'Kids clothing', 'Sneakers', 'Watches'],
    products: fallbackProducts.slice(0, 12).map((item) => [item.name, item.price, item.mrp, item.image_url])
  }
};

const Home = () => {
  const [products, setProducts] = useState([]);
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
      .then((res) => setProducts(res.data.products || []))
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
    const categoryFallbacks = pageConfig.products.map(([name, price, mrp, image_url], index) => ({
      id: `${selectedCategory || 'for-you'}-${index}`,
      name,
      price,
      mrp,
      image_url,
      rating: index % 2 ? 4.3 : 4.1,
      rating_count: 31 + index * 17
    }));
    const mixed = [...real, ...categoryFallbacks, ...fallbackProducts];
    return Array.from({ length: 36 }, (_, index) => mixed[index % mixed.length]);
  }, [products, pageConfig, selectedCategory]);

  const openProduct = (id) => {
    if (Number.isInteger(id)) navigate(`/product/${id}`);
  };

  const ProductTile = ({ item, tall = false }) => (
    <button className={`fk-feed-card ${tall ? 'is-tall' : ''}`} onClick={() => openProduct(item.id)}>
      <div className="fk-feed-img">
        <img src={item.image_url} alt={item.name} />
        <span>{item.rating || 4.2} * <small>({item.rating_count || 31})</small></span>
      </div>
      <b>{item.name}</b>
      <p><del>Rs. {(item.mrp || 999).toLocaleString()}</del> Rs. {(item.price || 299).toLocaleString()}</p>
      <strong>Rs. {Math.max(Math.round((item.price || 299) * 0.95), 99).toLocaleString()} with Bank offer</strong>
    </button>
  );

  const visibleHeroCards = [0, 1, 2].map((offset) => heroPool[(heroIndex + offset) % heroPool.length]);

  return (
    <div className="fk-home">
      <section className="fk-auto-hero">
        {visibleHeroCards.map((card, index) => (
          <button
            key={`${card.title}-${index}`}
            className={`fk-auto-hero-card hero-card-${index + 1}`}
            onClick={() => navigate(index === 0 ? '/?category=Mobiles' : '/?category=Electronics')}
          >
            <img src={card.image} alt={card.title} />
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
            <img src={productFeed[index]?.image_url || fallbackProducts[index % fallbackProducts.length].image_url} alt={label} />
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
            <img src={image} alt={label} />
            <span>{label}</span>
          </button>
        ))}
      </section>

      <section className="fk-grab">
        <h2>Grab or gone</h2>
        <div>
          {productFeed.slice(12, 16).map((item, index) => (
            <button key={`grab-${index}-${item.id}`} onClick={() => openProduct(item.id)}>
              <img src={item.image_url} alt={item.name} />
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
        <img src="/flipkart-home/everybody-list.png" alt="On everybody's list" />
      </section>

      <section className="fk-exact-section fk-grwm-banner">
        <img src="/flipkart-home/grwm-banner.png" alt="GRWM sale extra discounts" />
      </section>

      <RowSection title="Suggested For You" items={productFeed.slice(4, 12)} openProduct={openProduct} />

      <section className="fk-brands-real">
        <h2>Brands in Spotlight</h2>
        <div>
          {brandCards.map((card) => (
            <button key={card.title}>
              <img src={card.image} alt={card.title} />
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
      <button>→</button>
    </div>
    <div className="fk-real-strip">
      {items.map((item, index) => (
        <button key={`${title}-${index}-${item.id}`} onClick={() => Number.isInteger(item.id) && openProduct(item.id)}>
          <img src={item.image_url} alt={item.name} />
          <span>{item.rating || 4.1} *</span>
          <b>{item.name}</b>
          <p><del>Rs. {(item.mrp || 999).toLocaleString()}</del> Rs. {(item.price || 299).toLocaleString()}</p>
          <strong>Rs. {Math.max(Math.round((item.price || 299) * 0.95), 99).toLocaleString()} with Bank offer</strong>
        </button>
      ))}
    </div>
  </section>
);

export default Home;
