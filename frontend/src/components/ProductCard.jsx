import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { id, name, price, mrp, rating, rating_count, image_url } = product;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = isInWishlist(id);
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleWishlistToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLiked) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  return (
    <div className="product-card fk-real-card">
      <button
        onClick={handleWishlistToggle}
        className={`wishlist-toggle-button product-card-wishlist ${isLiked ? 'is-active' : ''}`}
        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} className={isLiked ? 'fill-current' : ''} />
      </button>

      <Link to={`/product/${id}`}>
        <div className="fk-real-card-image">
          <img src={image_url || '/favicon.svg'} alt={name} loading="lazy" />
        </div>

        <div className="fk-real-card-copy">
          <h4>{name}</h4>
          <div className="fk-real-card-rating">
            {rating > 0 && <span>{rating} *</span>}
            <small>({(rating_count || 0).toLocaleString()})</small>
            <b>Assured</b>
          </div>
          <div className="fk-real-card-price">
            <strong>Rs. {(price || 0).toLocaleString()}</strong>
            {mrp > price && <del>Rs. {mrp.toLocaleString()}</del>}
            {discount > 0 && <em>{discount}% off</em>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
