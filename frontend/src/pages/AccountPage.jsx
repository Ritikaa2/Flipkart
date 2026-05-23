import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Gift,
  Home,
  KeyRound,
  MoreVertical,
  Package,
  Plus,
  QrCode,
  ShieldCheck,
  Smartphone,
  Ticket,
  Trash2,
  User,
  WalletCards,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const sections = {
  profile: { title: 'Profile Information', group: 'ACCOUNT SETTINGS' },
  addresses: { title: 'Manage Addresses', group: 'ACCOUNT SETTINGS' },
  'gift-cards': { title: 'Gift Cards', group: 'PAYMENTS' },
  upi: { title: 'Saved UPI', group: 'PAYMENTS' },
  'saved-cards': { title: 'Manage Saved Cards', group: 'PAYMENTS' },
  coupons: { title: 'Available Coupons', group: 'MY STUFF' },
  notifications: { title: 'All Notifications', group: 'MY STUFF' }
};

const menuGroups = [
  { title: 'MY ORDERS', icon: Package, links: [{ to: '/orders', label: 'Orders', external: true }] },
  {
    title: 'ACCOUNT SETTINGS',
    icon: User,
    links: [
      { to: '/account/profile', section: 'profile', label: 'Profile Information' },
      { to: '/account/addresses', section: 'addresses', label: 'Manage Addresses' }
    ]
  },
  {
    title: 'PAYMENTS',
    icon: WalletCards,
    links: [
      { to: '/account/gift-cards', section: 'gift-cards', label: 'Gift Cards' },
      { to: '/account/upi', section: 'upi', label: 'Saved UPI' },
      { to: '/account/saved-cards', section: 'saved-cards', label: 'Saved Cards' }
    ]
  },
  {
    title: 'MY STUFF',
    icon: Ticket,
    links: [
      { to: '/account/coupons', section: 'coupons', label: 'My Coupons' },
      { to: '/wishlist', label: 'Wishlist', external: true },
      { to: '/account/notifications', section: 'notifications', label: 'Notifications' }
    ]
  }
];

const defaults = {
  addresses: [],
  upis: [{ id: 1, value: 'balmukand@upi', primary: true }],
  cards: [{ id: 1, bank: 'HDFC Bank', last4: '4242', type: 'Visa', tokenised: true }],
  giftCards: [],
  coupons: [
    { id: 1, title: 'Get products at Re.1', code: 'RE1DEAL', valid: 'Valid till 30 Jun, 2026', used: false },
    { id: 2, title: 'Extra 10% off on electronics', code: 'TECH10', valid: 'Valid till 30 Jun, 2026', used: false },
    { id: 3, title: 'Free delivery coupon', code: 'FREEDEL', valid: 'Valid till 30 Jun, 2026', used: false }
  ],
  notifications: [
    { id: 1, title: 'Order packed and ready for dispatch', text: 'Track your latest order from My Orders.', read: false },
    { id: 2, title: 'Wishlist item price dropped', text: 'One saved product has a better price today.', read: false },
    { id: 3, title: 'New bank offer available', text: 'Use eligible cards to unlock extra savings.', read: true }
  ]
};

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const AccountPage = () => {
  const { section = 'profile' } = useParams();
  const { user } = useAuth();
  const page = sections[section];

  const profile = useMemo(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  }), [user]);
  const [addresses, setAddresses] = useState(() => readStore('fk_addresses', defaults.addresses));
  const [upis, setUpis] = useState(() => readStore('fk_upis', defaults.upis));
  const [cards, setCards] = useState(() => readStore('fk_cards', defaults.cards));
  const [giftCards, setGiftCards] = useState(() => readStore('fk_gift_cards', defaults.giftCards));
  const [coupons, setCoupons] = useState(() => readStore('fk_coupons', defaults.coupons));
  const [notifications, setNotifications] = useState(() => readStore('fk_notifications', defaults.notifications));

  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', pincode: '', address: '' });
  const [upiValue, setUpiValue] = useState('');
  const [cardForm, setCardForm] = useState({ bank: '', last4: '', type: 'Visa' });
  const [giftForm, setGiftForm] = useState({ code: '', amount: '500' });
  const [giftQrOpen, setGiftQrOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => localStorage.setItem('fk_addresses', JSON.stringify(addresses)), [addresses]);
  useEffect(() => localStorage.setItem('fk_upis', JSON.stringify(upis)), [upis]);
  useEffect(() => localStorage.setItem('fk_cards', JSON.stringify(cards)), [cards]);
  useEffect(() => localStorage.setItem('fk_gift_cards', JSON.stringify(giftCards)), [giftCards]);
  useEffect(() => localStorage.setItem('fk_coupons', JSON.stringify(coupons)), [coupons]);
  useEffect(() => localStorage.setItem('fk_notifications', JSON.stringify(notifications)), [notifications]);

  const giftBalance = useMemo(() => giftCards.reduce((sum, card) => sum + Number(card.amount || 0), 0), [giftCards]);
  const generatedGiftCode = useMemo(() => {
    const amount = Number(giftForm.amount || 0);
    if (amount >= 5000) return 'BIGSAVE1000';
    if (amount >= 2000) return 'GIFT500OFF';
    if (amount >= 1000) return 'GIFT250OFF';
    return 'GIFT100OFF';
  }, [giftForm.amount]);

  if (!page) {
    return <Navigate to="/account/profile" replace />;
  }

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2400);
  };

  const addAddress = (e) => {
    e.preventDefault();
    setAddresses([{ id: Date.now(), ...addressForm }, ...addresses]);
    setAddressForm({ name: '', phone: '', pincode: '', address: '' });
    setAddressFormOpen(false);
    flash('Address added successfully.');
  };

  const addGiftCard = () => {
    if (Number(giftForm.amount) <= 0) return;
    setGiftCards([{ id: Date.now(), ...giftForm, code: giftForm.code.trim() || generatedGiftCode, paidWith: 'Razorpay QR' }, ...giftCards]);
    setGiftForm({ code: '', amount: '500' });
    setGiftQrOpen(false);
    flash('Gift card added after Razorpay QR payment.');
  };

  const renderQr = () => (
    <img
      className="fk-static-qr-img"
      src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=${encodeURIComponent(`upi://pay?pa=flipkart@razorpay&pn=Flipkart%20Gift%20Card&am=${giftForm.amount || 0}&cu=INR&tn=${giftForm.code || generatedGiftCode}`)}`}
      alt="Razorpay QR code for gift card payment"
    />
  );

  const renderContent = () => {
    if (section === 'profile') {
      return (
        <div className="fk-profile-grid">
          <form className="fk-profile-card" onSubmit={(e) => e.preventDefault()}>
            <div className="fk-section-head"><h2>Personal Information</h2></div>
            {['name', 'email', 'phone'].map((field) => (
              <div className="fk-form-row" key={field}>
                <label>{field === 'name' ? 'Full name' : field === 'email' ? 'Email address' : 'Mobile number'}</label>
                <input value={profile[field] || ''} readOnly />
              </div>
            ))}
          </form>
          <form className="fk-profile-card" onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); flash('Password changed successfully.'); }}>
            <div className="fk-section-head"><h2>Password Settings</h2><KeyRound size={18} /></div>
            <div className="fk-form-row"><label>Current password</label><input type="password" required /></div>
            <div className="fk-form-row"><label>New password</label><input type="password" required minLength={6} /></div>
            <button type="submit" className="fk-primary-button">Save Password</button>
          </form>
          <div className="fk-profile-help"><ShieldCheck size={22} /><div><h3>Account security</h3><p>This information comes from the account you registered or logged in with.</p></div></div>
        </div>
      );
    }

    if (section === 'addresses') {
      return (
        <div className="fk-list-panel">
          <button type="button" onClick={() => setAddressFormOpen(true)} className="fk-add-row"><Plus size={18} /> ADD A NEW ADDRESS</button>
          {addressFormOpen && (
            <form className="fk-address-form" onSubmit={addAddress}>
              <input placeholder="Name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} required />
              <input placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required />
              <input placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} required />
              <textarea placeholder="Full address" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} required />
              <div><button className="fk-primary-button">Save Address</button><button type="button" onClick={() => setAddressFormOpen(false)}>Cancel</button></div>
            </form>
          )}
          {addresses.map((address) => (
            <article key={address.id} className="fk-address-row">
              <MoreVertical size={18} className="fk-row-more" />
              <span className="fk-tag">HOME</span>
              <strong>{address.name} <b>{address.phone}</b></strong>
              <p>{address.address} - <b>{address.pincode}</b></p>
              <button type="button" className="fk-delete-link" onClick={() => setAddresses(addresses.filter((item) => item.id !== address.id))}><Trash2 size={14} /> Delete</button>
            </article>
          ))}
        </div>
      );
    }

    if (section === 'gift-cards') {
      return (
        <div className="fk-payment-workspace">
          <div className="fk-wallet-summary"><Gift size={34} /><div><small>Gift card balance</small><strong>Rs. {giftBalance.toLocaleString()}</strong></div></div>
          <div className="fk-profile-card">
            <div className="fk-section-head"><h2>Add Gift Card using Razorpay QR</h2><QrCode size={18} /></div>
            <div className="fk-form-row"><label>Amount</label><input value={giftForm.amount} onChange={(e) => setGiftForm({ ...giftForm, amount: e.target.value.replace(/\D/g, '') })} placeholder="Enter amount" /></div>
            <div className="fk-generated-code">
              <span>Generated offer code</span>
              <strong>{giftForm.code || generatedGiftCode}</strong>
              <small>Use this code to get more off on eligible checkout orders.</small>
            </div>
            <div className="fk-form-row"><label>Custom gift card code (optional)</label><input value={giftForm.code} onChange={(e) => setGiftForm({ ...giftForm, code: e.target.value.toUpperCase() })} placeholder={generatedGiftCode} /></div>
            <button type="button" className="fk-primary-button" onClick={() => setGiftQrOpen(true)}>Show Razorpay QR</button>
            {giftQrOpen && <div className="fk-qr-pay-box">{renderQr()}<div><h3>Scan with any UPI app</h3><p>Razorpay QR payment for Rs. {Number(giftForm.amount || 0).toLocaleString()}</p><p>Your code after payment: <b>{giftForm.code || generatedGiftCode}</b></p><button type="button" onClick={addGiftCard}>I have paid, add gift card</button></div></div>}
          </div>
          {giftCards.map((card) => <article className="fk-saved-payment" key={card.id}><Gift size={18} /><span>{card.code}</span><strong>Rs. {Number(card.amount).toLocaleString()}</strong><button onClick={() => setGiftCards(giftCards.filter((item) => item.id !== card.id))}><X size={15} /></button></article>)}
        </div>
      );
    }

    if (section === 'upi') {
      return (
        <div className="fk-payment-workspace">
          <form className="fk-inline-add" onSubmit={(e) => { e.preventDefault(); setUpis([{ id: Date.now(), value: upiValue, primary: upis.length === 0 }, ...upis]); setUpiValue(''); flash('UPI ID saved.'); }}>
            <Smartphone size={18} /><input value={upiValue} onChange={(e) => setUpiValue(e.target.value)} placeholder="example@upi" required /><button>Save UPI</button>
          </form>
          {upis.map((upi) => <article className="fk-saved-payment" key={upi.id}><Smartphone size={18} /><span>{upi.value}</span>{upi.primary && <b>Primary</b>}<button onClick={() => setUpis(upis.filter((item) => item.id !== upi.id))}><Trash2 size={15} /></button></article>)}
        </div>
      );
    }

    if (section === 'saved-cards') {
      return (
        <div className="fk-payment-workspace">
          <form className="fk-inline-add" onSubmit={(e) => { e.preventDefault(); setCards([{ id: Date.now(), ...cardForm, tokenised: true }, ...cards]); setCardForm({ bank: '', last4: '', type: 'Visa' }); flash('Card token saved.'); }}>
            <CreditCard size={18} /><input value={cardForm.bank} onChange={(e) => setCardForm({ ...cardForm, bank: e.target.value })} placeholder="Bank name" required /><input value={cardForm.last4} onChange={(e) => setCardForm({ ...cardForm, last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="Last 4 digits" required /><button>Save Card</button>
          </form>
          {cards.map((card) => <article className="fk-saved-payment" key={card.id}><CreditCard size={18} /><span>{card.bank} {card.type} ending {card.last4}</span><b>Tokenised</b><button onClick={() => setCards(cards.filter((item) => item.id !== card.id))}><Trash2 size={15} /></button></article>)}
        </div>
      );
    }

    if (section === 'coupons') {
      return (
        <div className="fk-coupon-list">
          {coupons.map((coupon) => (
            <article key={coupon.id} className={coupon.used ? 'is-used' : ''}>
              <div><h3>{coupon.title}</h3><p>Code: <b>{coupon.code}</b></p></div>
              <aside><strong>{coupon.used ? 'Applied' : coupon.valid}</strong><button type="button" onClick={() => { navigator.clipboard?.writeText(coupon.code); setCoupons(coupons.map((item) => item.id === coupon.id ? { ...item, used: true } : item)); flash('Coupon copied and marked as used.'); }}><Copy size={13} /> {coupon.used ? 'Used' : 'Use Coupon'}</button></aside>
            </article>
          ))}
        </div>
      );
    }

    return (
      <div className="fk-notification-list">
        <div className="fk-notification-actions"><button onClick={() => setNotifications(notifications.map((item) => ({ ...item, read: true })))}>Mark all as read</button><button onClick={() => setNotifications([])}>Clear all</button></div>
        {notifications.map((item) => (
          <article key={item.id} className={item.read ? 'is-read' : ''}>
            <Bell size={18} /><div><h3>{item.title}</h3><p>{item.text}</p></div>
            <button onClick={() => setNotifications(notifications.map((note) => note.id === item.id ? { ...note, read: true } : note))}><CheckCircle2 size={16} /></button>
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className="fk-account-page">
      <aside className="fk-account-sidebar">
        <div className="fk-account-user"><span><User size={30} /></span><div><small>Hello,</small><strong>{profile.name}</strong></div></div>
        <nav>
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.title}>
                <h3><GroupIcon size={20} /> {group.title}</h3>
                {group.links.map((link) => <Link key={link.label} to={link.to} className={link.section === section ? 'active' : ''}><span>{link.label}</span>{link.section === 'gift-cards' && <b>Rs. {giftBalance}</b>}{link.external && <ChevronRight size={17} />}</Link>)}
              </section>
            );
          })}
        </nav>
      </aside>
      <main className="fk-account-content">
        <div className="fk-account-title"><div><small>{page.group}</small><h1>{page.title}</h1></div><span><Home size={16} /> Flipkart secure account</span></div>
        {message && <div className="fk-account-toast"><CheckCircle2 size={16} /> {message}</div>}
        {renderContent()}
      </main>
    </div>
  );
};

export default AccountPage;
