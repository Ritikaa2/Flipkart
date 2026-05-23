import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BadgePercent,
  Bell,
  ChevronDown,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  Home,
  LogOut,
  MapPinned,
  Megaphone,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Ticket,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';

const navCategories = [
  { label: 'For You', icon: '/flipkart-icons/cat-for-you.png', to: '/' },
  { label: 'Fashion', icon: '/flipkart-icons/cat-fashion.png', to: '/?category=Fashion' },
  { label: 'Mobiles', icon: '/flipkart-icons/cat-mobiles.png', to: '/?category=Mobiles' },
  { label: 'Beauty', icon: '/flipkart-icons/cat-beauty.png', to: '/?category=Beauty' },
  { label: 'Electronics', icon: '/flipkart-icons/cat-electronics.png', to: '/?category=Electronics' },
  { label: 'Home', icon: '/flipkart-icons/cat-home.png', to: '/?category=Home' },
  { label: 'Appliances', icon: '/flipkart-icons/cat-appliances.png', to: '/?category=Appliances' },
  { label: 'Toys', icon: '/flipkart-icons/cat-toys.png', to: '/?category=Toys' },
  { label: 'Grocery', icon: '/flipkart-icons/cat-food.png', to: '/?category=Grocery' },
  { label: 'Auto', icon: '/flipkart-icons/cat-auto.png', to: '/?category=Auto' },
  { label: 'Two Wheelers', icon: '/flipkart-icons/cat-two-wheelers.png', to: '/?category=Two Wheelers' },
  { label: 'Sports', icon: '/flipkart-icons/cat-sports.png', to: '/?category=Sports' },
  { label: 'Books', icon: '/flipkart-icons/cat-books.png', to: '/?category=Books' },
  { label: 'Furniture', icon: '/flipkart-icons/cat-furniture.png', to: '/?category=Furniture' }
];

const accountLinks = [
  { label: 'My Profile', icon: User, to: '/account/profile' },
  { label: 'Orders', icon: Package, to: '/orders' },
  { label: 'Coupons', icon: Ticket, to: '/account/coupons' },
  { label: 'Supercoin', icon: BadgePercent, to: '/account/rewards' },
  { label: 'Flipkart Plus Zone', icon: Sparkles, to: '/account/plus' },
  { label: 'Saved Cards & Wallet', icon: CreditCard, to: '/account/saved-cards' },
  { label: 'Saved Addresses', icon: MapPinned, to: '/account/addresses' },
  { label: 'Wishlist', icon: Heart, to: '/wishlist' },
  { label: 'Gift Cards', icon: Gift, to: '/account/gift-cards' },
  { label: 'Notifications', icon: Bell, to: '/account/notifications' }
];

const moreLinks = [
  { label: 'Become a Seller', icon: Store, to: '/' },
  { label: 'Notification Settings', icon: Bell, to: '/account/notifications' },
  { label: '24x7 Customer Care', icon: Headphones, to: '/' },
  { label: 'Advertise on Flipkart', icon: Megaphone, to: '/' }
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openMenu, setOpenMenu] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenu('');
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(`/products/search?query=${encodeURIComponent(searchQuery)}`);
        setSuggestions((res.data.products || []).slice(0, 5));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Suggestion fetch issue:', err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeKey = new URLSearchParams(location.search).get('category') || (location.pathname === '/' ? 'For You' : '');
  const savedAddress = user?.address?.trim();
  const shortAddress = savedAddress && savedAddress.length > 38 ? `${savedAddress.slice(0, 38)}...` : savedAddress;

  const submitSearch = (event) => {
    event.preventDefault();
    setShowSuggestions(false);
    navigate(searchQuery.trim() ? `/?search=${encodeURIComponent(searchQuery.trim())}` : '/');
  };

  const selectSuggestion = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    navigate(item.id ? `/product/${item.id}` : `/?search=${encodeURIComponent(item.name)}`);
  };

  const closeMenu = () => setOpenMenu('');

  return (
    <nav className="fk-navbar">
      <div className="fk-nav-shell">
        <div className="fk-service-row">
          <Link to="/" className="fk-chip-image" aria-label="Flipkart"><img src="/flipkart-icons/chip-flipkart.png" alt="Flipkart" /></Link>
          <button className="fk-chip-image"><img src="/flipkart-icons/chip-emi.png" alt="EMI" /></button>
          <button className="fk-chip-image"><img src="/flipkart-icons/chip-travel.png" alt="Travel" /></button>
          <button className="fk-chip-image"><img src="/flipkart-icons/chip-grocery.png" alt="Grocery" /></button>
          {isAuthenticated && shortAddress && (
            <p className="fk-address-chip">
              <Home size={14} /> <b>HOME</b> {shortAddress} <ChevronDown size={13} />
            </p>
          )}
          <span className="fk-coin">0</span>
        </div>

        <div className="fk-search-row" ref={menuRef}>
          <div className="fk-search-box" ref={suggestionRef}>
            <form onSubmit={submitSearch}>
              <Search size={20} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length && setShowSuggestions(true)}
                placeholder="Search for Products, Brands and More"
              />
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="fk-suggestions">
                {suggestions.map((item) => (
                  <button key={item.id} onClick={() => selectSuggestion(item)}>
                    <Search size={14} />
                    <span>{item.name}</span>
                    <small>{item.category_name}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="fk-nav-actions">
            {isAuthenticated ? (
              <div className="fk-menu-wrap">
                <button className="fk-action" onClick={() => setOpenMenu(openMenu === 'account' ? '' : 'account')}>
                  <User size={18} /> {user.name?.split(' ')[0] || 'Balmukand'} <ChevronDown size={14} />
                </button>
                {openMenu === 'account' && (
                  <div className="fk-dropdown fk-account-dropdown">
                    <h4>Your Account</h4>
                    {accountLinks.map(({ label, icon: Icon, to }) => (
                      <Link key={label} to={to} onClick={closeMenu}><Icon size={16} /> {label}</Link>
                    ))}
                    <button onClick={() => { logout(); closeMenu(); navigate('/'); }}><LogOut size={16} /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="fk-action" to="/auth"><User size={18} /> Login</Link>
            )}

            <div className="fk-menu-wrap">
              <button className="fk-action" onClick={() => setOpenMenu(openMenu === 'more' ? '' : 'more')}>
                More <ChevronDown size={14} />
              </button>
              {openMenu === 'more' && (
                <div className="fk-dropdown fk-more-dropdown">
                  <h4>More</h4>
                  {moreLinks.map(({ label, icon: Icon, to }) => (
                    <Link key={label} to={to} onClick={closeMenu}><Icon size={16} /> {label}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/wishlist" className="fk-action fk-wishlist">
              <Heart size={18} />
              {wishlistItems.length > 0 && <small>{wishlistItems.length}</small>}
            </Link>

            <Link to="/cart" className="fk-action fk-cart">
              <ShoppingCart size={21} />
              {totalItems > 0 && <small>{totalItems}</small>}
              <span>Cart</span>
            </Link>
          </div>
        </div>

        <div className="fk-category-row">
          {navCategories.map(({ label, icon, to }) => {
            const isActive = activeKey === label || activeKey === label.replace('...', '') || to.includes(`category=${activeKey}`);
            return (
              <Link key={label} to={to} className={isActive ? 'active' : ''}>
                <img className="fk-cat-img" src={icon} alt="" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
