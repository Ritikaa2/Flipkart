import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { ArrowLeft, ArrowRight, BadgePercent, Clock, Headphones, Heart, ShieldCheck, Sparkles, Star, Truck, X, Zap } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hero Carousel Slide state
  const [currentSlide, setCurrentSlide] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Parse URL search/category parameters
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('category') || '';
  const searchQuery = params.get('search') || '';

  const handleWishlistToggle = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      const result = await addToWishlist(productId);
      if (!result.success) {
        navigate(`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      }
    }
  };

  // Carousel banners
  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
      title: "Super Saver Days",
      subtitle: "Fresh deals on phones, laptops, audio and everyday essentials"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      title: "Big Electronics Festival",
      subtitle: "Flagship tech, clean accessories and gaming gear at better prices"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
      title: "Wardrobe Refresh",
      subtitle: "New-season fashion, sneakers and travel picks curated for you"
    }
  ];

  const benefits = [
    { icon: Truck, title: 'Fast Delivery', text: 'Priority shipping on bestsellers' },
    { icon: ShieldCheck, title: 'Secure Checkout', text: 'Protected orders and easy returns' },
    { icon: BadgePercent, title: 'Daily Deals', text: 'Fresh offers across categories' },
    { icon: Headphones, title: 'Support', text: 'Help whenever your order needs it' }
  ];

  const editorialTiles = [
    {
      eyebrow: 'Top Pick',
      title: 'Premium electronics under one roof',
      text: 'Laptops, phones, speakers and accessories selected for work and play.',
      category: 'Electronics'
    },
    {
      eyebrow: 'Fresh Drop',
      title: 'Style upgrades for every day',
      text: 'Comfort-first fashion with sharp prices and easy wishlist saves.',
      category: 'Fashion'
    },
    {
      eyebrow: 'Home Edit',
      title: 'Useful finds for modern homes',
      text: 'Smart storage, decor and appliances that make routines smoother.',
      category: 'Furniture'
    }
  ];

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories/list');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Categories fetch failed:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products based on filter queries
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/products';
        const queryParams = [];
        
        if (selectedCategory) {
          queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (searchQuery) {
          queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
        }

        if (queryParams.length > 0) {
          endpoint += `?${queryParams.join('&')}`;
        }

        const res = await api.get(endpoint);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Products fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (catName) => {
    // If clicked category is already active, clear it. Else, filter by it.
    if (selectedCategory.toLowerCase() === catName.toLowerCase()) {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(catName)}`);
    }
  };

  const handleClearFilters = () => {
    navigate('/');
  };

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  const activeBanner = banners[currentSlide];
  const isListingMode = Boolean(selectedCategory || searchQuery);
  const listingTitle = searchQuery || selectedCategory || 'products';
  const visibleBrands = Array.from(new Set(products.map(item => item.brand).filter(Boolean))).slice(0, 7);

  const getHighlights = (item) => {
    let specs = item.specifications || {};
    if (typeof specs === 'string') {
      try {
        specs = JSON.parse(specs);
      } catch {
        specs = {};
      }
    }
    const entries = Object.entries(specs).slice(0, 5).map(([key, value]) => `${value} ${key}`);
    return entries.length > 0
      ? entries
      : [
          'Fast delivery with secure packaging',
          'Bank offers and exchange benefits available',
          'Quality checked by verified sellers'
        ];
  };

  return (
    <div className="home-page container mx-auto px-4 max-w-[1248px] py-4 select-none">
      
      {/* 2. Banner Slider (Carousel) */}
      {!selectedCategory && !searchQuery && (
        <div className="hero-carousel home-hero-pro relative h-[180px] md:h-[280px] w-full bg-slate-200 rounded-[4px] shadow-flip overflow-hidden mb-6 group select-none">
          <div
            className="home-hero-slide"
            style={{
              backgroundImage: `url(${activeBanner.image})`
            }}
          >
            <div className="text-white max-w-[50%] flex flex-col gap-2">
              <span className="hero-kicker">Curated for today</span>
              <h3 className="text-[20px] md:text-[32px] font-extrabold tracking-tight leading-tight">{activeBanner.title}</h3>
              <p className="text-[12px] md:text-[16px] text-gray-200 font-semibold">{activeBanner.subtitle}</p>
              <button
                onClick={() => navigate('/?category=Electronics')}
                className="bg-flipkart-yellow text-flipkart-dark font-bold text-[11px] md:text-[13px] px-4 py-2 mt-2 w-max rounded-[2px] hover:shadow-md transition uppercase"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-flipkart-dark p-2 rounded-full shadow-md md:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={18} />
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-flipkart-dark p-2 rounded-full shadow-md md:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight size={18} />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 w-2 rounded-full cursor-pointer transition ${
                  idx === currentSlide ? 'bg-white scale-125' : 'bg-white/55'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {!selectedCategory && !searchQuery && (
        <>
          <div className="benefit-strip grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="benefit-card">
                <span><Icon size={20} /></span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="editorial-grid grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {editorialTiles.map((tile, index) => (
              <button
                key={tile.title}
                onClick={() => navigate(`/?category=${encodeURIComponent(tile.category)}`)}
                className={`editorial-tile editorial-tile-${index + 1}`}
              >
                <span>{tile.eyebrow}</span>
                <h3>{tile.title}</h3>
                <p>{tile.text}</p>
                <small>Explore {tile.category}</small>
              </button>
            ))}
          </div>

          {products.length > 0 && (
            <div className="spotlight-section mb-6">
              <div className="spotlight-copy">
                <span><Sparkles size={16} /> Handpicked Deals</span>
                <h2>Beautiful picks people are shopping now</h2>
                <p>Quickly jump into high-value items from the live catalog, selected from your current store data.</p>
              </div>
              <div className="spotlight-products">
                {products.slice(0, 3).map((item) => (
                  <button key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="spotlight-product">
                    <img src={item.image_url || 'https://via.placeholder.com/120'} alt={item.name} />
                    <span>{item.name}</span>
                    <strong>₹{(item.price || 0).toLocaleString()}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. Product Section Container */}
      {isListingMode ? (
        <div className="listing-shell">
          <aside className="listing-filters">
            <h3>Filters</h3>
            <div className="filter-block">
              <strong>Categories</strong>
              <button onClick={() => navigate('/')}>For You</button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id || cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={selectedCategory === cat.name ? 'active' : ''}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="filter-block">
              <strong>Brand</strong>
              {(visibleBrands.length ? visibleBrands : ['Apple', 'Samsung', 'realme', 'MOTOROLA', 'vivo', 'OPPO']).map((brand) => (
                <label key={brand}>
                  <input type="checkbox" readOnly /> {brand}
                </label>
              ))}
            </div>
            <div className="filter-block">
              <strong>Customer Ratings</strong>
              <label><input type="checkbox" readOnly /> 4★ & above</label>
              <label><input type="checkbox" readOnly /> 3★ & above</label>
            </div>
            <div className="filter-block">
              <strong>Offers</strong>
              <label><input type="checkbox" readOnly /> Bank Offer</label>
              <label><input type="checkbox" readOnly /> No Cost EMI</label>
              <label><input type="checkbox" readOnly /> Special Price</label>
            </div>
          </aside>

          <section className="search-results-panel">
            <div className="search-breadcrumb">Home › {selectedCategory || 'Search'} › {listingTitle}</div>
            <div className="search-results-head">
              <h2>Showing 1 - {Math.max(products.length, 1)} of {Math.max(products.length * 325, products.length)} results for "{listingTitle}"</h2>
              <button onClick={handleClearFilters}>Clear Filter <X size={14} /></button>
            </div>
            <div className="sort-row">
              <strong>Sort By</strong>
              <span className="active">Relevance</span>
              <span>Popularity</span>
              <span>Price -- Low to High</span>
              <span>Price -- High to Low</span>
              <span>Newest First</span>
            </div>

            {isLoading ? (
              <div className="listing-loading">
                {[1, 2, 3].map((n) => <div key={n} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="search-product-list">
                {products.map((item, index) => {
                  const discount = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
                  return (
                    <article key={item.id} className="search-product-row" onClick={() => navigate(`/product/${item.id}`)}>
                      <div className="search-product-image">
                        <img src={item.image_url || 'https://via.placeholder.com/220'} alt={item.name} />
                        <label onClick={(e) => e.stopPropagation()}><input type="checkbox" readOnly /> Add to Compare</label>
                      </div>
                      <button
                        className={`wishlist-toggle-button row-wishlist ${isInWishlist(item.id) ? 'is-active' : ''}`}
                        onClick={(e) => handleWishlistToggle(e, item.id)}
                        aria-label={isInWishlist(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        title={isInWishlist(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart size={18} className={isInWishlist(item.id) ? 'fill-current' : ''} />
                      </button>
                      <div className="search-product-copy">
                        <span className="sponsored-label">{index % 3 === 0 ? 'Sponsored' : 'Flipkart assured'}</span>
                        <h3>{item.name}</h3>
                        <div className="row-rating">
                          <span>{item.rating || '4.2'} <Star size={11} className="fill-white" /></span>
                          <strong>{(item.rating_count || 48).toLocaleString()} Ratings & {(item.review_count || 12).toLocaleString()} Reviews</strong>
                        </div>
                        <ul>
                          {getHighlights(item).map((line) => <li key={line}>{line}</li>)}
                        </ul>
                      </div>
                      <div className="search-price-box">
                        <strong>₹{(item.price || 0).toLocaleString()}</strong>
                        {item.mrp > item.price && <span>₹{item.mrp.toLocaleString()} <em>{discount}% off</em></span>}
                        <small>Only few left</small>
                        <p>Bank Offer</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="listing-empty">
                <X size={48} />
                <h3>Sorry, no products found!</h3>
                <p>Check the spelling or try a different product, brand or category.</p>
                <button onClick={handleClearFilters}>View All Products</button>
              </div>
            )}
          </section>
        </div>
      ) : (
      <div className="product-section bg-white p-6 rounded-[4px] shadow-flip min-h-[50vh]">
        {/* Row Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-flipkart-dark tracking-tight">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : selectedCategory
                ? `Best of ${selectedCategory}`
                : 'Deals of the Day'}
            </h2>
            <p className="text-[12px] text-flipkart-textGray mt-0.5 font-semibold">
              {!isLoading ? `${products.length} curated items found` : 'Preparing your storefront...'}
            </p>
          </div>

          {!selectedCategory && !searchQuery && (
            <div className="deal-timer">
              <Clock size={15} />
              <span>Live deals refresh daily</span>
              <Zap size={15} />
            </div>
          )}

          {/* Active Filter Indicators */}
          {(selectedCategory || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-[2px] text-[13px] font-bold flex items-center gap-1.5 transition"
            >
              Clear Filter <X size={14} />
            </button>
          )}
        </div>

        {/* 4. Product Listings Grid */}
        {isLoading ? (
          /* Loading Skeleton Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-gray-100 rounded-[4px] p-4 flex flex-col gap-4 animate-pulse">
                <div className="h-[200px] bg-slate-100 w-full rounded" />
                <div className="h-4 bg-slate-100 w-3/4 rounded" />
                <div className="h-4 bg-slate-100 w-1/2 rounded" />
                <div className="h-8 bg-slate-100 w-full rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          /* Empty Search results display */
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in select-none">
            <div className="h-[140px] w-[140px] rounded-full bg-slate-50 flex items-center justify-center text-flipkart-blue mb-4 shadow-sm border border-slate-100">
              <X size={52} className="stroke-[1.5]" />
            </div>
            <h3 className="text-[18px] font-extrabold text-flipkart-dark">Sorry, no products found!</h3>
            <p className="text-[13px] text-flipkart-textGray mt-1 max-w-[340px] font-semibold">
              Check the spelling, clear active tags, or type a different product/brand name.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-flipkart-blue text-white px-6 py-2.5 mt-5 font-bold rounded-[2px] hover:shadow-md transition text-[13px]"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
      )}

    </div>
  );
};

export default Home;
