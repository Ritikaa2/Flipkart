import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();

  const navigate = useNavigate();
  const deliveryName = user?.name || 'Customer';
  const deliveryPhone = user?.phone || '123055';
  const deliveryAddress = user?.address || 'House no 337, dhani bilaspur, village dhanoor, Near Manoj B...';

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
        <div className="fk-cart-layout">
          <section className="fk-cart-panel">
            <div className="fk-cart-tabs">
              <button className="active">Flipkart ({totalItems})</button>
              <button>Grocery</button>
            </div>

            <div className="fk-cart-delivery-strip">
              <div>
                <strong>Deliver to: {deliveryName}, {deliveryPhone}</strong>
                <span>HOME</span>
                <p>{deliveryAddress}</p>
              </div>
              <button type="button" onClick={() => navigate('/account/addresses')}>Change</button>
            </div>

            <div className="fk-cart-list">
                {cartItems.map((item) => {
                  const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
                  const isOut = Number(item.stock) <= 0;
                  return (
                    <article key={item.id} className="fk-cart-row">
                      <Link to={`/product/${item.product_id}`} className="fk-cart-photo">
                        <img src={item.image_url} alt={item.name} />
                      </Link>

                      <div className="fk-cart-info">
                        <Link to={`/product/${item.product_id}`} className="fk-cart-title">
                          {item.name}
                        </Link>
                        <p>{item.color || 'Dark Green'}</p>
                        {isOut ? (
                          <strong className="fk-stock-out">Out Of Stock</strong>
                        ) : (
                          <>
                            <span className="fk-cart-seller">Seller: SuperCom Net <b>Assured</b></span>
                            <div className="fk-cart-price-line">
                              <del>Rs. {parseFloat(item.mrp).toLocaleString()}</del>
                              <strong>Rs. {parseFloat(item.price).toLocaleString()}</strong>
                              {discount > 0 && <span>{discount}% Off</span>}
                            </div>
                            <small>+ Rs. 86 Protect Promise Fee</small>
                            <small>Or Pay Rs. {Math.max(parseFloat(item.price) - 100, 0).toLocaleString()} + 100</small>
                          </>
                        )}

                        <div className="fk-cart-row-actions">
                          {!isOut && (
                            <div className="fk-cart-qty">
                              <button onClick={() => handleQtyChange(item, -1)} disabled={item.quantity <= 1}>-</button>
                              <input type="text" value={item.quantity} readOnly />
                              <button onClick={() => handleQtyChange(item, 1)} disabled={item.quantity >= item.stock}>+</button>
                            </div>
                          )}
                          <button type="button">Save for later</button>
                          <button type="button" onClick={() => handleRemove(item.id)}>Remove</button>
                        </div>
                      </div>

                      {!isOut && <aside>Delivery in 2 days, Mon</aside>}
                    </article>
                  );
                })}
            </div>

            <div className="fk-cart-bottom-bar">
                <button
                  onClick={() => navigate('/checkout')}
                  id="checkout-proceed-button"
                >
                  Place Order
                </button>
            </div>
          </section>

          <aside className="fk-cart-price-panel">
            <div className="fk-price-card">
              <h3>Price details</h3>
              <div>
                <p><span>MRP</span><b>Rs. {totalMrp.toLocaleString()}</b></p>
                <p><span>Fees ^</span><b></b></p>
                <p><span>Protect Promise Fee ({totalItems})</span><b>Rs. {Math.max(totalItems * 77, 0).toLocaleString()}</b></p>
                <hr />
                <p><span>Discounts ^</span><b></b></p>
                <p className="green"><span>Discount on MRP</span><b>- Rs. {totalDiscount.toLocaleString()}</b></p>
                <p className="green"><span>Coupons Applied ({Math.min(totalItems, 5)})</span><b>- Rs. {Math.min(totalDiscount, 138).toLocaleString()}</b></p>
                <hr />
                <p className="total"><span>Total Amount</span><b>Rs. {finalAmount.toLocaleString()}</b></p>
                <div className="fk-cart-save">You will save Rs. {totalDiscount.toLocaleString()} on this order</div>
                </div>
            </div>

            <div className="fk-cart-trust">
              <Shield size={24} />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;

