import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (productId) => {
    const res = await addToCart(productId, 1);
    if (res.success) {
      // Clean from wishlist on transfer for clean flow
      await removeFromWishlist(productId);
      navigate('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-flipkart-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container mx-auto px-4 max-w-[1248px] py-6 select-none animate-fade-in font-sans">
      {wishlistItems.length === 0 ? (
        /* Empty Wishlist display */
        <div className="bg-white p-16 text-center rounded-[4px] shadow-flip border border-gray-100 max-w-[600px] mx-auto select-none">
          <div className="h-[120px] w-[120px] rounded-full bg-slate-50 flex items-center justify-center text-flipkart-blue mx-auto mb-6 shadow-sm border border-slate-100">
            <Heart size={48} className="stroke-[1.5]" />
          </div>
          <h2 className="text-[19px] font-extrabold text-flipkart-dark">Empty Wishlist?</h2>
          <p className="text-[13px] text-flipkart-textGray mt-1 mb-6 font-semibold">
            Save your favorite gadgets and fashion items here to track discounts!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-flipkart-blue text-white px-8 py-3 font-bold rounded-[2px] hover:shadow-md transition text-[13px]"
          >
            Find Products
          </button>
        </div>
      ) : (
        <div className="fk-wishlist-panel">
          <div className="fk-wishlist-head">
            <h2>My Wishlist ({wishlistItems.length})</h2>
          </div>

          <div className="fk-wishlist-list">
            {wishlistItems.map((item) => {
              const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
              const unavailable = Number(item.stock) <= 0;
              return (
                <article key={item.id} className="fk-wishlist-row">
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    className="fk-wishlist-photo"
                  >
                    <img src={item.image_url} alt={item.name} />
                    {unavailable && <span>Currently unavailable</span>}
                  </button>

                  <div className="fk-wishlist-copy">
                    <button type="button" onClick={() => navigate(`/product/${item.product_id}`)}>{item.name}</button>
                    <small>Assured</small>
                    <div>
                      <strong>Rs. {parseFloat(item.price).toLocaleString()}</strong>
                      {item.mrp > item.price && <del>Rs. {parseFloat(item.mrp).toLocaleString()}</del>}
                      {discount > 0 && <span>{discount}% off</span>}
                    </div>
                    {!unavailable && (
                      <button
                        onClick={() => handleAddToCart(item.product_id)}
                        className="fk-wishlist-cart-button"
                      >
                        <ShoppingCart size={14} /> Move to cart
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.product_id)}
                    className="fk-wishlist-delete"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Back to Catalog */}
      <button
        onClick={() => navigate('/')}
        className="text-flipkart-blue hover:underline font-bold text-[13px] flex items-center gap-1.5 select-none mt-6 pl-1"
      >
        <ArrowLeft size={16} /> Return to Store Catalog
      </button>
    </div>
  );
};

export default Wishlist;

