import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { requestFirebaseNotificationToken } from '../services/firebase';
import { Check, ShieldCheck, CreditCard, Lock, QrCode, RefreshCw, Smartphone } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, totalItems, totalMrp, totalDiscount, finalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !localStorage.getItem('lastPlacedOrderId')) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Active accordion step tracking
  const [activeStep, setActiveStep] = useState(2); // Start at Step 2 (Address) since Step 1 (Login) is pre-verified

  // Address form fields
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [pinCode, setPinCode] = useState('');
  const [locality, setLocality] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressError, setAddressError] = useState('');
  const [savedAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fk_addresses')) || [];
    } catch {
      return [];
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Payment mock fields
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [qrPayment, setQrPayment] = useState(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setAddressError('');
    if (!shippingName || !shippingPhone || !pinCode || !locality || !city || !state) {
      setAddressError('Please fill in all the shipping address parameters.');
      return;
    }
    if (shippingPhone.trim().length < 10) {
      setAddressError('Please provide a valid 10-digit mobile number.');
      return;
    }
    setActiveStep(3); // Go to summary
  };

  const applySavedAddress = (address) => {
    setSelectedAddressId(address.id);
    setShippingName(address.name || shippingName);
    setShippingPhone(address.phone || shippingPhone);
    setLocality(address.address || '');
    setPinCode(address.pincode || '');
    setCity(address.city || '');
    setState(address.state || '');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (paymentMethod === 'Card') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        setPaymentError('Please fill in all your card credentials.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setPaymentError('Card number must be 16 digits.');
        return;
      }
    }

    if (paymentMethod === 'RazorpayQR' && !qrPayment) {
      setPaymentError('Please generate and scan the Razorpay QR before confirming your order.');
      return;
    }

    const firebaseToken = await requestFirebaseNotificationToken();

    // Start secure payment simulation
    setIsProcessing(true);
    
    // Format shipping address string
    const fullShippingAddress = `${locality}, City: ${city}, State: ${state} - PIN: ${pinCode}`;

    setTimeout(async () => {
      try {
        const orderData = {
          shipping_name: shippingName,
          shipping_phone: shippingPhone,
          shipping_address: fullShippingAddress,
          payment_method: paymentMethod,
          firebase_device_token: firebaseToken || '',
          cart_items: cartItems.map((item) => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity
          }))
        };

        const response = await api.post('/orders', orderData);
        const { orderId } = response.data;
        
        // Success: cache details, clean local cart, route to Success
        localStorage.setItem('lastPlacedOrderId', orderId);
        localStorage.setItem('lastPlacedOrderAmount', finalAmount);
        localStorage.setItem('lastOrderFirebaseSent', response.data.firebaseNotificationSent ? 'true' : 'false');
        localStorage.setItem('lastOrderFirebaseFallback', response.data.firebaseNotificationFallback ? 'true' : 'false');
        localStorage.setItem('lastOrderFirebaseMessageId', response.data.firebaseMessageId || '');
        localStorage.setItem('lastOrderEmailTo', response.data.emailTo || user?.email || '');
        localStorage.setItem('lastOrderEmailSent', response.data.emailSent ? 'true' : 'false');
        localStorage.setItem('lastOrderEmailFallback', response.data.emailFallback ? 'true' : 'false');
        clearCart();
        setIsProcessing(false);
        navigate(`/order-success`);
      } catch (err) {
        console.error("Order placing failure:", err);
        setPaymentError(err.response?.data?.message || 'Transaction declined. Please try again.');
        setIsProcessing(false);
      }
    }, 1800);
  };

  // Card input mask helper (adds spacing every 4 digits)
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const generateRazorpayQr = async () => {
    setPaymentError('');
    setIsQrLoading(true);
    try {
      const res = await api.post('/payments/razorpay-qr', {
        amount: finalAmount,
        customerName: shippingName || user?.name || 'Customer'
      });
      setQrPayment(res.data.qr);
    } catch (err) {
      console.error('QR creation failed:', err);
      setPaymentError(err.response?.data?.message || 'Direct QR could not be generated. Please use Open Razorpay Payment for real payment.');
    } finally {
      setIsQrLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placePaidOrder = async (method) => {
    const fullShippingAddress = `${locality}, City: ${city}, State: ${state} - PIN: ${pinCode}`;
    const firebaseToken = await requestFirebaseNotificationToken();
    const response = await api.post('/orders', {
      shipping_name: shippingName,
      shipping_phone: shippingPhone,
      shipping_address: fullShippingAddress,
      payment_method: method,
      firebase_device_token: firebaseToken || '',
      cart_items: cartItems.map((item) => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity
      }))
    });

    const { orderId } = response.data;
    localStorage.setItem('lastPlacedOrderId', orderId);
    localStorage.setItem('lastPlacedOrderAmount', finalAmount);
    localStorage.setItem('lastOrderFirebaseSent', response.data.firebaseNotificationSent ? 'true' : 'false');
    localStorage.setItem('lastOrderFirebaseFallback', response.data.firebaseNotificationFallback ? 'true' : 'false');
    localStorage.setItem('lastOrderFirebaseMessageId', response.data.firebaseMessageId || '');
    localStorage.setItem('lastOrderEmailTo', response.data.emailTo || user?.email || '');
    localStorage.setItem('lastOrderEmailSent', response.data.emailSent ? 'true' : 'false');
    localStorage.setItem('lastOrderEmailFallback', response.data.emailFallback ? 'true' : 'false');
    clearCart();
    navigate('/order-success');
  };

  const openRazorpayCheckout = async () => {
    setPaymentError('');
    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay checkout script could not load. Check internet connection.');
      }

      const res = await api.post('/payments/razorpay-order', { amount: finalAmount });
      const { key_id, order } = res.data;

      const razorpay = new window.Razorpay({
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Flipkart Clone',
        description: 'Secure Razorpay payment',
        order_id: order.id,
        prefill: {
          name: shippingName || user?.name || '',
          email: user?.email || '',
          contact: shippingPhone || user?.phone || ''
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        theme: {
          color: '#2874f0'
        },
        handler: async () => {
          try {
            await placePaidOrder('Razorpay');
          } catch (err) {
            setPaymentError(err.response?.data?.message || 'Payment done, but order creation failed.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      });

      razorpay.on('payment.failed', (response) => {
        setPaymentError(response.error?.description || 'Razorpay payment failed. Please try again.');
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      setPaymentError(err.response?.data?.message || err.message || 'Unable to open Razorpay checkout.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page container mx-auto px-4 max-w-[1248px] py-6 select-none animate-fade-in relative">
      
      {/* Premium Full screen Secure Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[2px] z-[999] flex flex-col justify-center items-center text-white select-none">
          <div className="h-16 w-16 border-[5px] border-flipkart-blue border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-[20px] font-bold tracking-wide flex items-center gap-2 text-flipkart-yellow select-none">
            <Lock size={20} className="animate-pulse" /> Processing Secure Bank Transaction...
          </h2>
          <p className="text-[13px] text-gray-300 mt-2 font-medium">Do not close window, refresh, or tap back buttons.</p>
        </div>
      )}

      <div className="checkout-progress-bar">
        {['Login', 'Address', 'Order Summary', 'Payment'].map((label, index) => (
          <div key={label} className={activeStep >= index + 1 ? 'active' : ''}>
            <span>{index + 1}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>

      {/* Main Grid Wrapper */}
      <div className="checkout-layout flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: Accordion Steps (68% width) */}
        <div className="checkout-steps w-full lg:w-[68%] flex flex-col gap-4">
          
          {/* STEP 1: USER SESSION (Locked) */}
          <div className="checkout-step bg-white rounded-[4px] shadow-flip border border-gray-100 overflow-hidden font-sans">
            <div className="px-6 py-4 flex items-center gap-4 bg-white border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-flipkart-blue text-[12px] font-bold flex items-center justify-center border border-gray-200">1</span>
              <div>
                <h4 className="text-[14px] font-bold text-flipkart-textGray uppercase tracking-wider flex items-center gap-1.5">
                  Login Session Verified <Check size={16} className="text-flipkart-green stroke-[3]" />
                </h4>
                <p className="text-[13px] text-flipkart-dark font-semibold mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* STEP 2: SHIPPING ADDRESS DETAILS */}
          <div className="checkout-step bg-white rounded-[4px] shadow-flip border border-gray-100 overflow-hidden font-sans">
            {/* Header tab */}
            <div
              className={`px-6 py-4 flex items-center gap-4 cursor-pointer select-none ${
                activeStep === 2 ? 'bg-flipkart-blue text-white' : 'bg-white border-b border-gray-100'
              }`}
              onClick={() => activeStep > 2 && setActiveStep(2)}
            >
              <span className={`w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center border ${
                activeStep === 2 ? 'bg-white text-flipkart-blue border-transparent' : 'bg-slate-100 text-flipkart-blue border-gray-200'
              }`}>2</span>
              <h4 className="text-[14px] font-bold uppercase tracking-wider">Delivery Address</h4>
              {activeStep > 2 && <Check size={16} className="ml-auto text-flipkart-green stroke-[3]" />}
            </div>

            {/* Panel Content */}
            {activeStep === 2 && (
              <form onSubmit={handleAddressSubmit} className="p-6 flex flex-col gap-5 animate-fade-in bg-white">
                {addressError && (
                  <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded text-[13px] font-semibold">
                    {addressError}
                  </div>
                )}

                {savedAddresses.length > 0 && (
                  <div className="checkout-saved-addresses">
                    <h5>Saved Addresses</h5>
                    {savedAddresses.map((address) => (
                      <button
                        type="button"
                        key={address.id}
                        onClick={() => applySavedAddress(address)}
                        className={selectedAddressId === address.id ? 'selected' : ''}
                      >
                        <span>HOME</span>
                        <strong>{address.name} <b>{address.phone}</b></strong>
                        <p>{address.address} - {address.pincode}</p>
                        <em>Deliver Here</em>
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Receiver Name</label>
                    <input
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Name of recipient"
                      className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue text-black bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">10-Digit Mobile Number</label>
                    <input
                      type="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="For delivery tracking updates"
                      className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue text-black bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Street Address / Locality / Landmark</label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Flat/House No, Building, Area, Landmark"
                      className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue text-black bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit PIN code"
                      className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue text-black bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City/District name"
                      className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue text-black bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State name"
                      className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue text-black bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-flipkart-orange hover:bg-orange-600 text-white font-bold px-8 py-3.5 mt-2 rounded-[2px] self-start transition text-[13px] tracking-wide uppercase select-none shadow-sm"
                >
                  Deliver Here & Continue
                </button>
              </form>
            )}
          </div>

          {/* STEP 3: ORDER SUMMARY */}
          <div className="checkout-step bg-white rounded-[4px] shadow-flip border border-gray-100 overflow-hidden font-sans">
            {/* Header tab */}
            <div
              className={`px-6 py-4 flex items-center gap-4 cursor-pointer select-none ${
                activeStep === 3 ? 'bg-flipkart-blue text-white' : 'bg-white border-b border-gray-100'
              }`}
              onClick={() => activeStep > 3 && setActiveStep(3)}
            >
              <span className={`w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center border ${
                activeStep === 3 ? 'bg-white text-flipkart-blue border-transparent' : 'bg-slate-100 text-flipkart-blue border-gray-200'
              }`}>3</span>
              <h4 className="text-[14px] font-bold uppercase tracking-wider">Order Summary</h4>
              {activeStep > 3 && <Check size={16} className="ml-auto text-flipkart-green stroke-[3]" />}
            </div>

            {/* Panel Content */}
            {activeStep === 3 && (
              <div className="p-6 flex flex-col gap-4 animate-fade-in bg-white">
                <div className="checkout-order-summary">
                  <div className="checkout-summary-deliver">
                    <div>
                      <span>Deliver to:</span>
                      <strong>{shippingName} <em>HOME</em></strong>
                      <p>{locality}{city ? `, ${city}` : ''}{state ? `, ${state}` : ''}{pinCode ? ` - ${pinCode}` : ''}</p>
                      <small>{shippingPhone}</small>
                    </div>
                    <button type="button" onClick={() => setActiveStep(2)}>Change</button>
                  </div>

                  <div className="checkout-summary-products">
                    {cartItems.map((item) => {
                      const itemPrice = parseFloat(item.price) || 0;
                      const itemMrp = parseFloat(item.mrp || item.price) || itemPrice;
                      const itemDiscount = itemMrp > itemPrice ? Math.round(((itemMrp - itemPrice) / itemMrp) * 100) : 7;

                      return (
                        <article key={item.id}>
                          <img src={item.image_url || 'https://via.placeholder.com/90'} alt={item.name} />
                          <div className="summary-product-copy">
                            <h3>{item.name}</h3>
                            <p>{item.brand || '4 GB RAM'}</p>
                            <div className="summary-rating">
                              <span>4.1</span>
                              <b>({(item.rating_count || 2176).toLocaleString()})</b>
                              <em>Assured</em>
                            </div>
                            <div className="summary-price-line">
                              <strong>{itemDiscount}%</strong>
                              <del>Rs. {itemMrp.toLocaleString()}</del>
                              <b>Rs. {itemPrice.toLocaleString()}</b>
                            </div>
                            <small>+ Rs. 86 Protect Promise Fee</small>
                            <small>Or Pay Rs. {Math.max(itemPrice - 100, 0).toLocaleString()} + 100</small>
                            <div className="summary-delivery-line">EXPRESS Delivery in 2 days, Sat</div>
                            {/* <label><input type="checkbox" /> Use GST Invoice</label> */}
                          </div>
                          <select defaultValue={item.quantity}>
                            {[1, 2, 3, 4, 5].map((qty) => <option key={qty} value={qty}>Qty: {qty}</option>)}
                          </select>
                        </article>
                      );
                    })}
                  </div>

                  <div className="checkout-openbox-note">
                    <strong>Rest assured with Open Box Delivery</strong>
                    <p>Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery. <button type="button">Why?</button></p>
                  </div>

                  <div className="checkout-summary-bottom">
                    <div>
                      <del>Rs. {totalMrp.toLocaleString()}</del>
                      <strong>Rs. {finalAmount.toLocaleString()}</strong>
                    </div>
                    <button onClick={() => setActiveStep(4)}>Continue</button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded bg-white">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-[13.5px] font-medium text-gray-800">
                      <div className="flex-1 truncate pr-4">
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="text-[11.5px] text-flipkart-textGray mt-0.5 block">Quantity: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-flipkart-dark shrink-0">Rs. {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-[3px] mt-2">
                  <span className="text-[14px] font-bold text-gray-700">Subtotal for ({totalItems} items):</span>
                  <span className="text-[17px] font-extrabold text-flipkart-blue">Rs. {finalAmount.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setActiveStep(4)}
                  className="bg-flipkart-orange hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-[2px] self-start transition text-[13px] tracking-wide uppercase select-none shadow-sm"
                >
                  Continue To Payment
                </button>
              </div>
            )}
          </div>

          {/* STEP 4: PAYMENT OPTIONS */}
          <div className="checkout-step bg-white rounded-[4px] shadow-flip border border-gray-100 overflow-hidden font-sans">
            {/* Header tab */}
            <div
              className={`px-6 py-4 flex items-center gap-4 select-none ${
                activeStep === 4 ? 'bg-flipkart-blue text-white' : 'bg-white border-b border-gray-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center border ${
                activeStep === 4 ? 'bg-white text-flipkart-blue border-transparent' : 'bg-slate-100 text-flipkart-blue border-gray-200'
              }`}>4</span>
              <h4 className="text-[14px] font-bold uppercase tracking-wider">Payment Options</h4>
            </div>

            {/* Panel Content */}
            {activeStep === 4 && (
              <form onSubmit={handlePlaceOrder} className="p-6 flex flex-col gap-6 animate-fade-in bg-white">
                <div className="checkout-payment-title">
                  <button type="button" onClick={() => setActiveStep(3)}>Back</button>
                  <h3>Complete Payment</h3>
                  <span><Lock size={13} /> 100% Secure</span>
                </div>

                {paymentError && (
                  <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded text-[13px] font-semibold">
                    {paymentError}
                  </div>
                )}

                {/* Selection Radios */}
                <div className="payment-method-list flex flex-col gap-4 border border-gray-150 rounded-[4px] overflow-hidden bg-white select-none">
                  {/* Option 1: Card */}
                  <label className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer transition hover:bg-slate-50 ${
                    paymentMethod === 'Card' ? 'bg-blue-50/20' : ''
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="Card"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="accent-flipkart-blue h-4 w-4"
                    />
                    <CreditCard size={18} className="text-gray-500" />
                    <span className="text-[14px] font-bold text-gray-700">Credit / Debit / ATM Card</span>
                  </label>

                  {/* Option 2: Razorpay QR */}
                  <label className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer transition hover:bg-slate-50 ${
                    paymentMethod === 'RazorpayQR' ? 'bg-blue-50/20' : ''
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="RazorpayQR"
                      checked={paymentMethod === 'RazorpayQR'}
                      onChange={() => setPaymentMethod('RazorpayQR')}
                      className="accent-flipkart-blue h-4 w-4"
                    />
                    <QrCode size={18} className="text-gray-500" />
                    <span className="text-[14px] font-bold text-gray-700">Razorpay UPI QR Code</span>
                    <span className="ml-auto text-[11px] font-bold text-flipkart-green bg-green-50 border border-green-100 px-2 py-1 rounded">Recommended</span>
                  </label>

                  {/* Option 3: COD */}
                  <label className={`flex items-center gap-3 p-4 cursor-pointer transition hover:bg-slate-50 ${
                    paymentMethod === 'COD' ? 'bg-blue-50/20' : ''
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-flipkart-blue h-4 w-4"
                    />
                    <span className="text-[14px] font-bold text-gray-700">Cash on Delivery (COD)</span>
                  </label>
                </div>

                {/* Card inputs conditional form */}
                {paymentMethod === 'Card' && (
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-[4px] flex flex-col gap-4 animate-fade-in select-none">
                    <h5 className="text-[13px] font-bold text-flipkart-textGray uppercase tracking-wider mb-1">Card Details</h5>
                    
                    <div>
                      <label className="text-[12px] text-gray-500 font-semibold block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue bg-white text-black text-center tracking-wider"
                        required={paymentMethod === 'Card'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] text-gray-500 font-semibold block mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue bg-white text-black text-center"
                          required={paymentMethod === 'Card'}
                        />
                      </div>
                      <div>
                        <label className="text-[12px] text-gray-500 font-semibold block mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="***"
                          className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] font-medium outline-none focus:border-flipkart-blue bg-white text-black text-center font-mono"
                          required={paymentMethod === 'Card'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'RazorpayQR' && (
                  <div className="razorpay-qr-box bg-slate-50 border border-slate-100 p-6 rounded-[4px] flex flex-col gap-4 animate-fade-in select-none">
                    <div className="qr-box-header">
                      <div>
                        <h5 className="text-[13px] font-bold text-flipkart-textGray uppercase tracking-wider mb-1">Scan & Pay with Razorpay</h5>
                        <p>Open any UPI app, scan the QR, complete payment, then confirm your order.</p>
                      </div>
                      <Smartphone size={28} />
                    </div>

                    <div className="qr-payment-area">
                      <div className="qr-preview">
                        {qrPayment ? (
                          <img src={qrPayment.display_image_url || qrPayment.image_url} alt="Razorpay UPI QR code" />
                        ) : (
                          <QrCode size={96} />
                        )}
                      </div>

                      <div className="qr-payment-copy">
                        <span className="qr-amount">Rs. {finalAmount.toLocaleString()}</span>
                        <strong>Real Razorpay Checkout</strong>
                        <p>Open Razorpay secure checkout. Select UPI to scan/pay using your UPI app. This works even when direct QR API is unavailable.</p>
                        {qrPayment?.id && <small>Reference: {qrPayment.id}</small>}
                        <button
                          type="button"
                          onClick={openRazorpayCheckout}
                          disabled={isProcessing}
                          className="qr-generate-button"
                        >
                          <Smartphone size={15} /> Open Razorpay Payment
                        </button>
                        <button
                          type="button"
                          onClick={generateRazorpayQr}
                          disabled={isQrLoading}
                          className="qr-secondary-button"
                        >
                          {isQrLoading ? (
                            <>
                              <RefreshCw size={15} className="animate-spin" /> Generating QR...
                            </>
                          ) : qrPayment ? (
                            <>
                              <RefreshCw size={15} /> Regenerate QR
                            </>
                          ) : (
                            <>
                              <QrCode size={15} /> Generate Razorpay QR
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="qr-note">
                      Recommended: Open Razorpay Payment. Direct QR API optional hai aur Razorpay account me QR feature enabled hona chahiye.
                    </div>
                  </div>
                )}

                {/* Place Order submit */}
                <button
                  type="submit"
                  className="bg-flipkart-orange hover:bg-orange-600 text-white font-extrabold px-12 py-4 rounded-[2px] self-end transition text-[14px] tracking-wide uppercase select-none shadow-sm"
                  id="place-order-submit-button"
                >
                  Pay Rs. {finalAmount.toLocaleString()} & Confirm Order
                </button>
              </form>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Price summary display card (32% width) */}
        <div className="checkout-sidebar w-full lg:w-[32%] lg:sticky lg:top-[76px] flex flex-col gap-4 font-sans select-none">
          <div className="price-summary-card bg-white rounded-[4px] shadow-flip border border-gray-100 overflow-hidden">
            <div className="px-6 py-3.5 border-b border-gray-100">
              <h3 className="font-bold text-[13px] text-flipkart-textGray uppercase tracking-wider">Price Details</h3>
            </div>

            <div className="p-6 space-y-4 text-[14px] font-medium text-gray-700">
              <div className="flex justify-between">
                <span>Price ({totalItems} Items)</span>
                <span className="font-semibold text-flipkart-dark">Rs. {totalMrp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-flipkart-green">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {totalDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-flipkart-green font-bold">FREE</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between text-[17px] font-bold text-flipkart-dark">
                <span>Total Payable</span>
                <span className="text-flipkart-blue">Rs. {finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-green-50/50 border-t border-gray-100 p-4 text-[13.5px] font-bold text-flipkart-green text-center flex items-center justify-center gap-2 select-none">
              <ShieldCheck size={16} className="text-flipkart-green fill-green-150" />
              <span>You save Rs. {totalDiscount.toLocaleString()} on this order!</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;

