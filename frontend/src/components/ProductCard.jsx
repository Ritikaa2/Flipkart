import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { id, name, price, mrp, rating, rating_count, image_url } = product;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isLiked = isInWishlist(id);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  return (
    <div className="product-card bg-white rounded-[4px] overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 relative group flex flex-col h-full">
      <button
        onClick={handleWishlistToggle}
        className={`wishlist-toggle-button product-card-wishlist ${isLiked ? 'is-active' : ''}`}
        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={17}
          className={isLiked ? 'fill-current' : ''}
        />
      </button>

      <Link to={`/product/${id}`} className="flex flex-col flex-1">
        <div className="h-[200px] w-full flex items-center justify-center p-4 bg-white relative overflow-hidden select-none">
          <span className="product-card-ribbon">Deal</span>
          <img
            src={image_url || 'https://via.placeholder.com/200'}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="p-4 pt-1 flex flex-col flex-1 border-t border-gray-50">
          <div className="product-card-meta">
            <span>Express</span>
            <small>Top rated</small>
          </div>

          <h4 className="text-[14px] font-medium text-flipkart-dark group-hover:text-flipkart-blue transition-colors line-clamp-2 leading-5 h-10 mb-1">
            {name}
          </h4>

          <div className="flex items-center gap-2 mb-2 text-[12px] font-medium select-none">
            {rating > 0 && (
              <span className="bg-flipkart-green text-white px-1.5 py-0.5 rounded-[3px] text-[11px] flex items-center gap-0.5 font-bold">
                {rating} <span className="text-[9px]">*</span>
              </span>
            )}
            <span className="text-flipkart-textGray font-semibold">({(rating_count || 0).toLocaleString()})</span>

            <span className="ml-auto text-[9px] bg-flipkart-lightBlue border border-blue-100 text-flipkart-blue px-1 py-0.5 rounded font-extrabold italic uppercase tracking-wider select-none shrink-0">
              Assured
            </span>
          </div>

          <div className="mt-auto flex items-baseline gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-flipkart-dark">₹{(price || 0).toLocaleString()}</span>
            {mrp > price && (
              <>
                <span className="text-[13px] text-flipkart-textGray line-through">₹{mrp.toLocaleString()}</span>
                <span className="text-[13px] text-flipkart-green font-bold">{discount}% off</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
