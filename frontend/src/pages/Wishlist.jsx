import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star } from 'lucide-react';

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
        /* Full Wishlist Grid */
        <div className="bg-white rounded-[4px] shadow-flip overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white font-semibold">
            <span className="text-[16px] text-flipkart-dark">My Wishlist ({wishlistItems.length} Items)</span>
          </div>

          <div className="divide-y divide-gray-100">
            {wishlistItems.map((item) => {
              const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
              return (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 bg-white hover:bg-slate-50/10 transition animate-fade-in">
                  
                  {/* Image */}
                  <div
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    className="w-[100px] h-[100px] flex items-center justify-center shrink-0 p-1 border border-gray-100 rounded bg-white cursor-pointer self-center sm:self-start"
                  >
                    <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  {/* Core detail summary */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title name */}
                      <h4
                        onClick={() => navigate(`/product/${item.product_id}`)}
                        className="text-[14px] font-bold text-flipkart-dark hover:text-flipkart-blue transition cursor-pointer line-clamp-2 leading-relaxed"
                      >
                        {item.name}
                      </h4>

                      {/* Ratings */}
                      <div className="flex items-center gap-2 mt-1.5 text-[12px] font-medium select-none">
                        {item.rating > 0 && (
                          <span className="bg-flipkart-green text-white px-1.5 py-0.5 rounded-[3px] text-[11px] flex items-center gap-0.5 font-bold">
                            {item.rating} <Star size={10} className="fill-white" />
                          </span>
                        )}
                        <span className="text-flipkart-textGray">({(item.rating_count || 0).toLocaleString()})</span>
                      </div>

                      {/* Prices details */}
                      <div className="flex items-baseline gap-2.5 mt-2 flex-wrap text-[13px]">
                        <span className="text-[16px] font-bold text-flipkart-dark">Rs. {parseFloat(item.price).toLocaleString()}</span>
                        {item.mrp > item.price && (
                          <>
                            <span className="text-flipkart-textGray line-through">Rs. {parseFloat(item.mrp).toLocaleString()}</span>
                            <span className="text-flipkart-green font-bold">{discount}% Off</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* CTA operations row */}
                    <div className="flex items-center gap-6 mt-4 select-none">
                      {/* Transfer to Cart */}
                      <button
                        onClick={() => handleAddToCart(item.product_id)}
                        disabled={item.stock <= 0}
                        className="bg-flipkart-orange hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-[2px] text-[12px] flex items-center gap-1.5 transition select-none tracking-wide shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={14} /> ADD TO CART
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="text-[12px] font-bold text-flipkart-textGray hover:text-red-600 flex items-center gap-1.5 transition select-none"
                      >
                        <Trash2 size={14} /> REMOVE
                      </button>
                    </div>
                  </div>

                </div>
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

