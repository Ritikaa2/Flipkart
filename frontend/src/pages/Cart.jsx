import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, ArrowLeft, Shield } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    isLoading,
    updateCartQuantity,
    removeFromCart,
    totalItems,
    totalMrp,
    totalDiscount,
    finalAmount
  } = useCart();

  const navigate = useNavigate();

  const handleQtyChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > item.stock) return;
    await updateCartQuantity(item.id, newQty);
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-flipkart-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="cart-page container mx-auto px-4 max-w-[1248px] py-6 select-none animate-fade-in">
      {cartItems.length === 0 ? (
        /* Empty Cart State Screen */
        <div className="bg-white p-16 text-center rounded-[4px] shadow-flip border border-gray-100 max-w-[600px] mx-auto select-none">
          <div className="h-[120px] w-[120px] rounded-full bg-slate-50 flex items-center justify-center text-flipkart-blue mx-auto mb-6 shadow-sm border border-slate-100">
            <ShoppingBag size={48} className="stroke-[1.5]" />
          </div>
          <h2 className="text-[19px] font-extrabold text-flipkart-dark">Missing Cart Items?</h2>
          <p className="text-[13px] text-flipkart-textGray mt-1 mb-6 font-semibold">
            Login to see active items or add items from home to get started!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-flipkart-blue text-white px-8 py-3 font-bold rounded-[2px] hover:shadow-md transition text-[13px]"
          >
            Shop Now
          </button>
        </div>
      ) : (
        /* Full Cart Grid Layout */
        <div className="cart-layout flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT CART LIST COLUMN (70% width) */}
          <div className="w-full lg:w-[68%] flex flex-col gap-4">
            <div className="bg-white rounded-[4px] shadow-flip overflow-hidden border border-gray-100">
              
              {/* Cart Table Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white font-semibold">
                <span className="text-[16px] text-flipkart-dark">Flipkart Cart ({totalItems} Items)</span>
                <span className="text-[13px] text-flipkart-blue font-bold"></span>
              </div>

              {/* Items listing rows */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
                  return (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6 bg-white animate-fade-in">
                      
                      {/* Left: Product Image */}
                      <div className="w-[100px] h-[100px] flex items-center justify-center shrink-0 p-1 border border-gray-100 rounded bg-white self-center md:self-start">
                        <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>

                      {/* Right: Info contents */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Name title */}
                          <Link
                            to={`/product/${item.product_id}`}
                            className="text-[14px] font-semibold text-flipkart-dark hover:text-flipkart-blue transition line-clamp-2 leading-relaxed"
                          >
                            {item.name}
                          </Link>
                          
                          {/* Seller detail */}
                          <span className="text-[11px] text-flipkart-textGray mt-1 block font-semibold">
                            Seller: SuperCom Net
                          </span>

                          {/* Pricing row */}
                          <div className="flex items-baseline gap-2.5 mt-2 flex-wrap text-[13px]">
                            <span className="text-[17px] font-bold text-flipkart-dark">₹{parseFloat(item.price).toLocaleString()}</span>
                            {item.mrp > item.price && (
                              <>
                                <span className="text-flipkart-textGray line-through">₹{parseFloat(item.mrp).toLocaleString()}</span>
                                <span className="text-flipkart-green font-bold">{discount}% Off</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Adjusters Row */}
                        <div className="flex items-center gap-6 mt-4 select-none">
                          {/* Counter */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQtyChange(item, -1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center bg-slate-50 text-[16px] font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-10 text-center outline-none border border-gray-150 rounded-[2px] text-[13px] py-0.5 bg-white font-semibold"
                            />
                            <button
                              onClick={() => handleQtyChange(item, 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center bg-slate-50 text-[16px] font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                            >
                              +
                            </button>
                          </div>

                          {/* Delete Item action */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-[13px] font-bold text-flipkart-dark hover:text-red-600 flex items-center gap-1.5 transition select-none"
                          >
                            <Trash2 size={15} /> REMOVE
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Sticky bottom checkout strip */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-white shadow-inner">
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-flipkart-orange hover:bg-orange-600 text-white font-bold px-10 py-3.5 rounded-[2px] transition text-[14px] shadow-sm tracking-wide uppercase font-sans select-none"
                  id="checkout-proceed-button"
                >
                  Place Order
                </button>
              </div>

            </div>

            {/* Back to Catalog */}
            <button
              onClick={() => navigate('/')}
              className="text-flipkart-blue hover:underline font-bold text-[13px] flex items-center gap-1.5 self-start select-none py-1"
            >
              <ArrowLeft size={16} /> Continue Shopping Catalog
            </button>
          </div>

          {/* RIGHT PRICE CARD COLUMN (30% width, Sticky) */}
          <div className="w-full lg:w-[32%] lg:sticky lg:top-[76px] flex flex-col gap-4">
            <div className="bg-white rounded-[4px] shadow-flip border border-gray-100 overflow-hidden font-sans">
              
              {/* Header */}
              <div className="px-6 py-3.5 border-b border-gray-100 bg-white">
                <h3 className="font-bold text-[13px] text-flipkart-textGray uppercase tracking-wider">Price Details</h3>
              </div>

              {/* Financial Breakdowns */}
              <div className="p-6 space-y-4 text-[14px] font-medium text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({totalItems} Items)</span>
                  <span className="font-semibold text-flipkart-dark">₹{totalMrp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-flipkart-green">
                  <span>Discount</span>
                  <span className="font-semibold">- ₹{totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-flipkart-green font-bold">FREE</span>
                </div>

                {/* Total Paid line */}
                <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between text-[17px] font-bold text-flipkart-dark">
                  <span>Total Amount</span>
                  <span className="text-flipkart-blue">₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Savings callout panel */}
              <div className="bg-green-50/50 border-t border-gray-100 p-4 text-[13.5px] font-bold text-flipkart-green text-center flex items-center justify-center gap-2 select-none leading-relaxed">
                <Shield size={16} className="text-flipkart-green fill-green-150 shrink-0" />
                <span>You will save ₹{totalDiscount.toLocaleString()} on this order</span>
              </div>

            </div>

            {/* Quality assurance shield */}
            <div className="flex items-center gap-3 text-[11px] font-bold text-flipkart-textGray select-none border border-gray-150/40 p-3 rounded bg-white">
              <Shield size={28} className="text-gray-400 shrink-0" />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products guarantee.</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
