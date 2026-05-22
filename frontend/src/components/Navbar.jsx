import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Store,
  MapPin,
  Plane,
  Shirt,
  Smartphone,
  Sparkles,
  Monitor,
  Home,
  Baby,
  Utensils,
  Bike,
  Dumbbell,
  BookOpen,
  Armchair,
  Gift,
  Bell,
  CreditCard,
  MapPinned,
  Ticket,
  Package,
  BadgePercent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const suggestionRef = useRef(null);
  const accountRef = useRef(null);

  const navCategories = [
    { label: 'For You', icon: Store, to: '/' },
    { label: 'Fashion', icon: Shirt, to: '/?category=Fashion' },
    { label: 'Mobiles', icon: Smartphone, to: '/?category=Mobiles' },
    { label: 'Beauty', icon: Sparkles, to: '/?search=beauty' },
    { label: 'Electronics', icon: Monitor, to: '/?category=Electronics' },
    { label: 'Home', icon: Home, to: '/?category=Furniture' },
    { label: 'Appliances', icon: Monitor, to: '/?category=Appliances' },
    { label: 'Toys & Kids', icon: Baby, to: '/?search=kids' },
    { label: 'Food', icon: Utensils, to: '/?category=Grocery' },
    { label: 'Auto', icon: Bike, to: '/?search=auto' },
    { label: 'Sports', icon: Dumbbell, to: '/?search=sports' },
    { label: 'Books', icon: BookOpen, to: '/?search=books' },
    { label: 'Furniture', icon: Armchair, to: '/?category=Furniture' }
  ];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    setSearchQuery(searchParam || '');
  }, [location.search]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const response = await api.get(`/products/search?query=${searchQuery}`);
          setSuggestions(response.data.products.slice(0, 5) || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Suggestion fetch issue:', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const selectSuggestion = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    navigate(`/?search=${encodeURIComponent(name)}`);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="site-navbar site-header-pro">
      <div className="header-pro-shell">
        <Link to="/" className="global-home-logo" aria-label="Go to Flipkart home">
          <span>F</span>
        </Link>
        <div className="header-top-strip">
          <Link to="/" className="brand-pill">
            <span>Flipkart</span>
            <small>Explore Plus</small>
          </Link>
          <button type="button" className="header-chip">
            <BadgePercent size={18} /> EMI
          </button>
          <button type="button" className="header-chip">
            <Plane size={18} /> Travel
          </button>
          <div className="delivery-location">
            <MapPin size={17} />
            <span>Location not set</span>
            <strong>Select delivery location</strong>
          </div>
        </div>

        <div className="header-main-row">
          <Link to="/" className="brand-pill header-main-brand">
            <span>Flipkart</span>
            <small>Explore Plus</small>
          </Link>

          <div className="search-shell" ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit}>
              <Search size={21} className="search-leading-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                placeholder="Search for Products, Brands and More"
                id="search-input"
              />
              <button type="submit">
                <Search size={20} />
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectSuggestion(item.name)}
                    className="search-suggestion-item"
                  >
                    <Search size={14} />
                    <span>{item.name}</span>
                    <small>{item.category_name}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="header-actions">
            {isAuthenticated ? (
              <div ref={accountRef} className="account-menu">
                <button
                  type="button"
                  onClick={() => setShowDropdown(prev => !prev)}
                  className="account-trigger"
                >
                  <User size={20} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={showDropdown ? 'rotate-180' : ''} />
                </button>

                {showDropdown && (
                  <div className="account-dropdown">
                    <h4>Your Account</h4>
                    <Link onClick={() => setShowDropdown(false)} to="/account/profile"><User size={17} /> My Profile</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/orders"><Package size={17} /> Orders</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/account/coupons"><Ticket size={17} /> Coupons</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/account/saved-cards"><CreditCard size={17} /> Saved Cards & Wallet</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/account/addresses"><MapPinned size={17} /> Saved Addresses</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/wishlist"><Heart size={17} /> Wishlist</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/account/gift-cards"><Gift size={17} /> Gift Cards</Link>
                    <Link onClick={() => setShowDropdown(false)} to="/account/notifications"><Bell size={17} /> Notifications</Link>
                    <button onClick={handleLogout}><LogOut size={17} /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="login-pop-button" id="login-button">Login</Link>
            )}

            <Link to="/wishlist" className="more-action wishlist-nav-action">
              <Heart size={20} />
              <span>Wishlist</span>
              {wishlistItems.length > 0 && <small>{wishlistItems.length}</small>}
            </Link>

            <Link to="/cart" className="cart-action">
              <ShoppingCart size={23} />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              <strong>Cart</strong>
            </Link>
          </div>
        </div>

        <div className="header-category-row">
          {navCategories.map(({ label, icon: Icon, to }) => (
            <Link key={label} to={to} className="header-category-item">
              <Icon size={23} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
