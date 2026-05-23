import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Heart, Star, CheckCircle, ShieldAlert, MessageSquare, PackageCheck, RotateCcw, ShieldCheck, ThumbsUp } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const productCopy = {
  1: 'A compact pro iPhone made for people who want flagship power without a bulky feel. The titanium body feels premium in hand, the A17 Pro chip keeps gaming and editing smooth, and the 48MP camera captures crisp detail for travel, portraits, and daily moments.',
  2: 'A big-screen Samsung flagship for productivity, photos, notes, and entertainment. The S Pen is handy for quick edits, the bright display is easy to read outdoors, and the 200MP camera setup gives you plenty of room to crop, zoom, and shoot in low light.',
  3: 'A fast, polished OnePlus phone for heavy everyday use. Apps open quickly, the display looks rich and fluid, and the fast charger is useful when you need a quick top-up before work, college, or travel.',
  4: 'A light MacBook for work, study, browsing, and creative tasks. It starts quickly, stays quiet, and gives dependable battery life, making it easy to carry from desk to cafe to classroom without feeling weighed down.',
  5: 'Comfortable over-ear headphones for flights, office focus, and late-night music. Noise cancellation cuts distractions well, calls sound clear, and the soft earcups make long listening sessions easier.',
  6: 'A clean dark blue shirt that works for office days, casual evenings, and weekend plans. The cotton fabric feels breathable, the regular fit is easy to wear, and the solid color pairs well with jeans or chinos.',
  7: 'Sporty everyday sneakers with a familiar Air Max look and soft cushioning underfoot. They are easy to style with jeans, joggers, and casual fits while still feeling comfortable for long walks.',
  8: 'A simple queen-size platform bed that gives the room a neat, modern base. The engineered wood build feels steady, the wenge finish is easy to match, and the low profile keeps the bedroom looking clean.',
  9: 'A practical work chair for study tables and home offices. The mesh back keeps air moving, the seat feels supportive for daily work, and the rolling base makes it easy to shift around your desk.',
  10: 'A front-load washing machine built for regular family laundry. It handles clothes gently, saves power with inverter technology, and offers useful wash motions for daily wear, towels, and delicate fabrics.',
  11: 'A spacious refrigerator for fresh produce, leftovers, drinks, and freezer storage. Convertible modes make it flexible for busy weeks, and twin cooling helps keep food fresher for longer.',
  12: 'A kitchen staple with the bold aroma people expect from kachi ghani mustard oil. It works well for tadka, frying, marinades, and traditional Indian recipes where flavor matters.',
  13: 'Soft, reliable atta for everyday rotis and parathas. The wheat has a familiar homemade taste, kneads easily, and gives rotis that stay soft for family meals.',
  14: 'A clean Android flagship with excellent cameras and helpful Pixel software. Photos look natural, the display is bright and sharp, and the phone feels smooth for everyday multitasking.',
  15: 'A stylish Motorola phone with a curved pOLED display and very fast charging. It feels slim in hand, looks premium, and has enough power for social apps, photos, streaming, and daily work.',
  16: 'A gaming laptop for players and creators who need strong graphics performance. The RTX GPU, fast display, and sturdy build make it suitable for games, editing, college projects, and demanding apps.',
  17: 'Lightweight earbuds for music, calls, workouts, and gaming breaks. The case is easy to carry, battery backup is strong for the price, and the sound has the punch people like for daily listening.',
  18: 'A beginner-friendly DSLR for learning real photography. The kit lens is versatile, the grip feels secure, and Wi-Fi sharing makes it simple to move your shots after portraits, travel, or events.',
  19: "Classic blue Levi's jeans with a slim fit that still feels wearable through the day. The wash is easy to pair, the fabric has comfortable stretch, and the style works with shirts, tees, and sneakers.",
  20: 'A minimal Fastrack watch for everyday outfits. The black dial keeps it sharp, the strap feels comfortable, and the simple design fits casual, college, and semi-formal looks.',
  21: 'A roomy tote for office, shopping, and travel days. It has space for daily essentials, a secure zip closure, and a polished texture that looks good without trying too hard.',
  22: 'A supportive mattress for people who prefer balanced firmness. Memory foam eases pressure around the back and shoulders, while the breathable top fabric keeps sleep comfortable through the night.',
  23: 'A compact coffee table for apartments and living rooms. The walnut finish looks warm, the open shelf is useful for remotes and magazines, and the size keeps the room uncluttered.',
  24: 'A cordless vacuum that makes quick cleaning less tiring. It is light enough for sofas, corners, cars, and everyday floor dust, with useful attachments for spots a normal broom misses.',
  25: 'A useful air fryer for crispy snacks with much less oil. It is easy to set, quick to clean, and works well for fries, nuggets, cutlets, reheating, and small everyday batches.',
  26: 'A compact instant geyser for quick hot water in bathrooms and kitchens. The LED indicator is easy to read, the tank heats fast, and the safety features make it practical for daily use.',
  27: 'Unpolished toor dal for homely dals, sambhar, khichdi, and everyday Indian meals. It cooks with a natural taste and keeps the simple comfort of pantry staples.',
  28: 'A dependable instant coffee for quick hot coffee, cold coffee, and dessert recipes. The aroma is familiar, the jar stores neatly, and one spoon is enough for a fresh daily cup.',
  29: 'A portable JBL speaker for travel, small parties, and outdoor plans. It has strong bass, a sturdy waterproof build, and enough battery to keep music going through the evening.',
  30: 'A value-focused 5G phone with a smooth AMOLED display and capable Sony camera sensor. It looks stylish, charges fast, and handles daily apps, photos, and entertainment without fuss.'
};

const getDescription = (product) => productCopy[Number(product?.id)] || product?.description || '';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const prodData = res.data.product;
        setProduct(prodData);
        if (prodData.images && prodData.images.length > 0) {
          setActiveImage(prodData.images[0]);
        } else {
          setActiveImage(prodData.image_url);
        }
      } catch (err) {
        console.error("Fetch details error:", err);
        setError('Failed to fetch details for this product. It may have been removed.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-flipkart-blue border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 max-w-[1248px] py-16 text-center">
        <div className="bg-white p-10 rounded-[4px] shadow-flip max-w-[500px] mx-auto border border-gray-100">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-[18px] font-bold text-flipkart-dark">{error || 'Product Not Found'}</h3>
          <button
            onClick={() => navigate('/')}
            className="bg-flipkart-blue text-white px-6 py-2.5 mt-5 font-bold rounded-[2px] hover:shadow-md transition text-[13px]"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const { name, price, mrp, rating, rating_count, review_count, specifications, stock, images } = product;

  // Calculate discount percentage
  const discount = Math.round(((mrp - price) / mrp) * 100);
  const isLiked = isInWishlist(product.id);

  const handleWishlistToggle = async () => {
    if (isLiked) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleAddToCart = async () => {
    if (stock <= 0) return;
    const res = await addToCart(product.id, 1);
    if (res.success) {
      navigate('/cart');
    } else {
      // If not logged in, redirect to auth page with a redirect parameter
      navigate(`/auth?redirect=/product/${product.id}`);
    }
  };

  const handleBuyNow = async () => {
    if (stock <= 0) return;
    const res = await addToCart(product.id, 1);
    if (res.success) {
      navigate('/checkout');
    } else {
      navigate(`/auth?redirect=/product/${product.id}`);
    }
  };

  const displayImages = (images && images.length ? images : [activeImage || product.image_url || '/favicon.svg'])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="product-detail-page container mx-auto px-4 max-w-[1248px] py-6 animate-fade-in select-none">
      
      {/* Detail Layout Box */}
      <div className="product-detail-shell bg-white p-6 rounded-[4px] shadow-flip flex flex-col lg:flex-row gap-8 items-start relative border border-gray-100">
        
        {/* Wishlist Floating Pill */}
        <button
          onClick={handleWishlistToggle}
          className={`wishlist-toggle-button product-wishlist-button absolute top-6 right-6 z-10 ${isLiked ? 'is-active' : ''}`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={isLiked ? 'fill-current' : ''}
          />
        </button>

        {/* LEFT COLUMN: Product image grid */}
        <div className="product-media-column w-full lg:w-[48%] flex flex-col gap-4 lg:sticky lg:top-[76px] self-start">
          <div className="product-image-grid">
            {displayImages.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`product-image-tile ${idx === 0 ? 'is-primary' : ''} ${activeImage === img ? 'is-active' : ''}`}
              >
                <img src={img} alt={`${name} view ${idx + 1}`} />
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="product-action-row flex gap-3 flex-wrap sm:flex-nowrap mt-2 select-none">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className={`flex-1 font-extrabold text-[15px] py-4 rounded-[2px] transition shadow-sm flex items-center justify-center gap-2 select-none uppercase tracking-wide border ${
                stock <= 0
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-flipkart-orange hover:bg-orange-600 text-white border-transparent'
              }`}
              id="add-to-cart-button"
            >
              <ShoppingCart size={18} /> {stock <= 0 ? 'Out of stock' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className={`flex-1 font-extrabold text-[15px] py-4 rounded-[2px] transition shadow-sm flex items-center justify-center gap-2 select-none uppercase tracking-wide border ${
                stock <= 0
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-flipkart-yellow hover:bg-[#e6b000] text-flipkart-dark border-transparent'
              }`}
              id="buy-now-button"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Scrolling specs information */}
        <div className="product-info-column flex-1 select-none w-full">
          {/* Breadcrumb path */}
          <div className="product-breadcrumb text-[12px] font-semibold text-flipkart-textGray flex items-center gap-1.5 mb-2.5">
            <span>Home</span> &gt; <span>{product.category_name}</span> &gt; <span className="truncate text-gray-500 font-bold max-w-[200px]">{name}</span>
          </div>

          {/* Title */}
          <h1 className="text-[18px] md:text-[21px] font-medium text-flipkart-dark leading-7 mb-2">
            {name}
          </h1>

          {/* Ratings review stats */}
          <div className="product-rating-row flex items-center gap-3 mb-4 text-[13px] font-semibold text-flipkart-textGray">
            {rating > 0 && (
              <span className="bg-flipkart-green text-white px-2 py-0.5 rounded-[3px] text-[12px] flex items-center gap-0.5 font-bold select-none shrink-0">
                {rating} <Star size={11} className="fill-white" />
              </span>
            )}
            <span>{(rating_count || 0).toLocaleString()} Ratings & {(review_count || 0).toLocaleString()} Reviews</span>
            <span className="text-[10px] bg-flipkart-lightBlue border border-blue-100 text-flipkart-blue px-1.5 py-0.5 rounded font-extrabold italic uppercase shrink-0">f-Assured</span>
          </div>

          {/* Pricing Row */}
          <div className="product-price-row flex items-baseline gap-3 mb-6 flex-wrap border-b border-gray-100 pb-5">
            <span className="text-[28px] font-bold text-flipkart-dark">Rs. {price.toLocaleString()}</span>
            {mrp > price && (
              <>
                <span className="text-[16px] text-flipkart-textGray line-through">Rs. {mrp.toLocaleString()}</span>
                <span className="text-[16px] text-flipkart-green font-bold">{discount}% Off</span>
              </>
            )}
          </div>

          {/* Stock Notification pill */}
          <div className="product-stock-row mb-6 font-semibold">
            {stock <= 0 ? (
              <div className="inline-block bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-[13px]">
                Currently Out Of Stock
              </div>
            ) : stock <= 10 ? (
              <div className="inline-block bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded text-[13px]">
                Hurry! Only {stock} left in stock!
              </div>
            ) : (
              <div className="inline-block bg-green-50 text-flipkart-green border border-green-200 px-3 py-1 rounded text-[13px]">
                Item Available (In Stock)
              </div>
            )}
          </div>

          <div className="product-delivery-box">
            <div>
              <strong>Delivery</strong>
              <span>Check fastest delivery date, COD and serviceability for your area</span>
            </div>
            <button type="button">Enter Delivery Pincode</button>
          </div>

          {/* Available Offers section (Flipkart dynamic promo lists) */}
          <div className="product-offers-card mb-6 bg-slate-50 border border-slate-100 p-4 rounded-[4px]">
            <h3 className="font-bold text-[14px] text-flipkart-dark mb-3 uppercase tracking-wider">Available Offers</h3>
            <ul className="space-y-2.5 text-[13px] font-medium text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-flipkart-green mt-0.5 shrink-0" />
                <span><strong>Bank Offer:</strong> Flat Rs. 1,250 Instant Discount on SBI Credit Card transactions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-flipkart-green mt-0.5 shrink-0" />
                <span><strong>Bank Offer:</strong> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-flipkart-green mt-0.5 shrink-0" />
                <span><strong>Partner Offer:</strong> Sign up for Flipkart Pay Later & get shopping gift card worth Rs. 250.</span>
              </li>
            </ul>
          </div>

          {/* Description Section */}
          <div className="product-desc-card mb-8">
            <h3 className="font-bold text-[14px] text-flipkart-dark uppercase tracking-wider mb-2">Product Description</h3>
            <p className="text-[14px] font-normal leading-6 text-gray-600">{getDescription(product)}</p>
          </div>

          {/* Specifications Relational Table */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="product-specs-card">
              <h3 className="font-bold text-[14px] text-flipkart-dark uppercase tracking-wider mb-3">Specifications</h3>
              <div className="border border-gray-200 rounded-[4px] overflow-hidden text-[13px] font-medium">
                {Object.entries(specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex border-b border-gray-100 ${
                      idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <div className="w-[30%] p-3.5 border-r border-gray-100 text-flipkart-textGray shrink-0">{key}</div>
                    <div className="flex-1 p-3.5 text-gray-800 font-semibold">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product-deep-content">
            <div className="detail-info-grid">
              <div>
                <PackageCheck size={22} />
                <strong>Delivery by Tomorrow</strong>
                <p>Free delivery, open-box check, and live tracking after dispatch.</p>
              </div>
              <div>
                <RotateCcw size={22} />
                <strong>7 Days Replacement</strong>
                <p>Easy replacement for damaged, defective, or wrong products.</p>
              </div>
              <div>
                <ShieldCheck size={22} />
                <strong>Secure Payment</strong>
                <p>Cards, COD, and Razorpay QR supported in checkout.</p>
              </div>
            </div>

            <div className="reviews-panel">
              <div className="reviews-summary">
                <span>{rating}</span>
                <div>
                  <strong>Excellent</strong>
                  <p>{(rating_count || 0).toLocaleString()} ratings and {(review_count || 0).toLocaleString()} reviews</p>
                </div>
              </div>

              <div className="review-list">
                <div className="review-item">
                  <div><Star size={13} className="fill-white" /> 5</div>
                  <strong>Worth every rupee</strong>
                  <p>Product quality feels premium, delivery was quick, and packaging looked safe.</p>
                  <small><ThumbsUp size={13} /> Certified Buyer, Bengaluru</small>
                </div>
                <div className="review-item">
                  <div><Star size={13} className="fill-white" /> 4</div>
                  <strong>Good value deal</strong>
                  <p>Nice discount and smooth shopping flow. Specifications and offers are easy to compare.</p>
                  <small><MessageSquare size={13} /> Reviewed after 7 days</small>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;

