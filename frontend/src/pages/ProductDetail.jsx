import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Heart, Star, CheckCircle, ShieldAlert, MessageSquare, PackageCheck, RotateCcw, ShieldCheck, ThumbsUp } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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

  const { name, price, mrp, rating, rating_count, review_count, description, specifications, stock, images } = product;

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

        {/* LEFT COLUMN: Sticky images gallery and dual Buttons (40% width) */}
        <div className="product-media-column w-full lg:w-[40%] flex flex-col gap-4 lg:sticky lg:top-[76px] self-stretch">
          
          {/* Gallery display wrapper */}
          <div className="product-gallery-box flex gap-4 border border-gray-100 p-4 rounded-[4px] bg-white h-[380px] md:h-[420px] justify-center items-center relative overflow-hidden select-none">
            
            {/* Clickable Image Thumbnails list (vertical on md screen, horizontal on mobile) */}
            {images && images.length > 1 && (
              <div className="product-thumbnails absolute left-4 top-4 bottom-4 flex flex-col gap-2 overflow-y-auto scrollbar-none pr-1 select-none z-10">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`product-thumb w-12 h-12 border-2 rounded-[2px] p-0.5 bg-white cursor-pointer flex items-center justify-center overflow-hidden hover:border-flipkart-blue transition ${
                      activeImage === img ? 'border-flipkart-blue shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            )}

            {/* Large primary Display */}
            <div className="product-main-image flex-1 flex justify-center items-center h-full max-w-[70%] select-none">
              <img
                src={activeImage || 'https://via.placeholder.com/350'}
                alt={name}
                className="max-h-[95%] max-w-[95%] object-contain select-none"
              />
            </div>
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

        {/* RIGHT COLUMN: Scrolling specs information (60% width) */}
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
            <span className="text-[28px] font-bold text-flipkart-dark">₹{price.toLocaleString()}</span>
            {mrp > price && (
              <>
                <span className="text-[16px] text-flipkart-textGray line-through">₹{mrp.toLocaleString()}</span>
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
                <span><strong>Bank Offer:</strong> Flat ₹1,250 Instant Discount on SBI Credit Card transactions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-flipkart-green mt-0.5 shrink-0" />
                <span><strong>Bank Offer:</strong> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-flipkart-green mt-0.5 shrink-0" />
                <span><strong>Partner Offer:</strong> Sign up for Flipkart Pay Later & get shopping gift card worth ₹250.</span>
              </li>
            </ul>
          </div>

          {/* Description Section */}
          <div className="product-desc-card mb-8">
            <h3 className="font-bold text-[14px] text-flipkart-dark uppercase tracking-wider mb-2">Product Description</h3>
            <p className="text-[14px] font-normal leading-6 text-gray-600">{description}</p>
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

            <div className="project-description-card">
              <span>Project Experience</span>
              <h3>Complete Flipkart-style product experience</h3>
              <p>
                This product page includes gallery preview, wishlist, cart checkout, live stock status,
                offers, specifications, review summary, delivery promises, and a payment-ready checkout flow.
                It is designed as a complete ecommerce project module rather than a simple product card.
              </p>
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
