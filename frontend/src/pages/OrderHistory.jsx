import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, ArrowLeft, CheckCircle2, Copy, Home, MessageCircle, PackageCheck, RotateCcw, Search, ShieldCheck, ShoppingBag, WalletCards, XCircle } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [itemsMap, setItemsMap] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found a better price');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/orders');
        const loadedOrders = res.data.orders || [];
        setOrders(loadedOrders);

        const details = await Promise.all(
          loadedOrders.map(async (order) => {
            try {
              const detailRes = await api.get(`/orders/details/${order.id}`);
              return [order.id, detailRes.data.items || []];
            } catch {
              return [order.id, []];
            }
          })
        );
        setItemsMap(Object.fromEntries(details));
      } catch (err) {
        console.error('Orders load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  const selectedItems = selectedOrder ? itemsMap[selectedOrder.id] || [] : [];
  const refreshOrderDetails = async (orderId) => {
    const detailRes = await api.get(`/orders/details/${orderId}`);
    setItemsMap((prev) => ({ ...prev, [orderId]: detailRes.data.items || [] }));
    if (detailRes.data.order) {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? detailRes.data.order : order)));
    }
  };

  const decoratedOrders = useMemo(() => orders.map((order) => {
    const items = itemsMap[order.id] || [];
    const firstItem = items[0] || {};
    const placedDate = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const rawStatus = order.order_status || order.status || '';
    const isCancelled = rawStatus.toLowerCase().includes('cancel');
    const isDelivered = rawStatus.toLowerCase().includes('deliver');
    const status = isCancelled ? 'Cancelled' : isDelivered ? 'Delivered' : 'Order placed';
    return {
      ...order,
      firstItem,
      status,
      statusText: isCancelled ? `Cancelled on ${placedDate}` : isDelivered ? `Delivered on ${placedDate}` : `Order placed on ${placedDate}`
    };
  }), [orders, itemsMap]);

  const visibleOrders = decoratedOrders.filter((order) => {
    const text = `${order.id} ${order.shipping_name} ${order.firstItem?.name || ''}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-4 border-flipkart-blue border-t-transparent" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty-state">
        <ShoppingBag size={52} />
        <h2>No Orders Placed Yet!</h2>
        <p>Browse the catalog and place an order to see Flipkart-style tracking here.</p>
        <button onClick={() => navigate('/')}>Start Shopping</button>
      </div>
    );
  }

  if (selectedOrder) {
    const amount = parseInt(selectedOrder.final_amount || 0);
    const firstItem = selectedItems[0] || {};
    const orderDate = new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const isCancelled = String(selectedOrder.order_status || '').toLowerCase() === 'cancelled';
    const refundStatus = selectedOrder.refund_status || (isCancelled ? 'Refund processing' : 'Not requested');
    const cancelOrder = async () => {
      setCancelMessage('');
      if (!window.confirm('Cancel this order and start refund processing?')) return;
      setIsCancelling(true);
      try {
        const res = await api.put(`/orders/${selectedOrder.id}/cancel`, { reason: cancelReason });
        setOrders((prev) => prev.map((order) => (order.id === selectedOrder.id ? { ...order, ...res.data.order } : order)));
        await refreshOrderDetails(selectedOrder.id);
        setCancelMessage(`${res.data.message}. Refund ETA: ${res.data.refund?.eta || '3-5 business days'}.`);
      } catch (err) {
        setCancelMessage(err.response?.data?.message || 'Unable to cancel this order right now.');
      } finally {
        setIsCancelling(false);
      }
    };

    return (
      <div className="fk-order-detail-page">
        <div className="fk-order-breadcrumb">Home &gt; My Account &gt; My Orders &gt; OD{String(selectedOrder.id).padStart(16, '0')}</div>
        <button className="fk-order-back" onClick={() => setSelectedOrderId(null)}><ArrowLeft size={16} /> Back to orders</button>
        <section className="fk-order-detail-layout">
          <main>
            <div className="fk-refund-box">
              <strong>{isCancelled ? 'Refund request created' : `Total paid - Rs. ${amount.toLocaleString()}`}</strong>
              <div><WalletCards size={18} /><b>Rs. {amount.toLocaleString()}</b><span>{selectedOrder.payment_status || 'Paid'}</span></div>
              <p>{isCancelled ? `Refund to ${selectedOrder.payment_method || 'original payment method'} is now processing. Bank settlement normally takes 3-5 business days.` : `Your order was placed successfully using ${selectedOrder.payment_method}. You can cancel before shipment and get a refund to the original payment option.`}</p>
              <button>How do I track this order?</button>
            </div>

            <div className={`fk-cancel-refund-panel ${isCancelled ? 'is-cancelled' : ''}`}>
              <div>
                <span>{isCancelled ? <XCircle size={22} /> : <RotateCcw size={22} />}</span>
                <div>
                  <h3>{isCancelled ? 'Order cancelled' : 'Cancel order and refund payment'}</h3>
                  <p>{isCancelled ? `Reason: ${selectedOrder.cancel_reason || 'Cancelled by customer'}` : 'Refund will be initiated to your original payment method after cancellation.'}</p>
                </div>
              </div>
              <div className="fk-refund-steps">
                <p className="active"><ShieldCheck size={15} /> Eligibility checked</p>
                <p className={isCancelled ? 'active' : ''}><XCircle size={15} /> Order cancelled</p>
                <p className={isCancelled ? 'active' : ''}><WalletCards size={15} /> {refundStatus}</p>
              </div>
              {!isCancelled ? (
                <div className="fk-cancel-form">
                  <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                    <option>Found a better price</option>
                    <option>Ordered by mistake</option>
                    <option>Delivery is taking too long</option>
                    <option>Need to change address or payment</option>
                  </select>
                  <button type="button" onClick={cancelOrder} disabled={isCancelling}>
                    {isCancelling ? 'Cancelling...' : 'Cancel order & refund'}
                  </button>
                </div>
              ) : (
                <div className="fk-refund-success"><CheckCircle2 size={16} /> Refund processing to {selectedOrder.payment_method || 'original payment method'}</div>
              )}
              {cancelMessage && <small className={cancelMessage.includes('Unable') ? 'error' : ''}>{cancelMessage}</small>}
            </div>

            <div className="fk-detail-product">
              <div>
                <h2>{firstItem.name || `Order #${selectedOrder.id}`}</h2>
                <p>{firstItem.color || 'Black'}</p>
                <small>Seller: SuperCom Net</small>
                <strong>Rs. {amount.toLocaleString()} <em>1 offer</em></strong>
              </div>
              <img src={firstItem.image_url || 'https://via.placeholder.com/120'} alt={firstItem.name || 'Order item'} />
            </div>

            <div className="fk-timeline">
              <div className="done"><span><CheckCircle2 size={13} /></span><p>Order Confirmed, {orderDate}</p></div>
              <div className={isCancelled ? 'cancelled' : 'done'}><span>{isCancelled ? <XCircle size={13} /> : <PackageCheck size={13} />}</span><p>{isCancelled ? 'Order cancelled and refund initiated' : 'Seller is preparing your item'}</p></div>
              {showAllUpdates && (
                <div className="fk-extra-updates">
                  <p><b>Payment successful</b><span>{selectedOrder.payment_method} payment completed for Rs. {amount.toLocaleString()}.</span></p>
                  <p><b>Order created</b><span>Order #OD{String(selectedOrder.id).padStart(16, '0')} added to your account.</span></p>
                  <p><b>{isCancelled ? 'Refund update' : 'Delivery update'}</b><span>{isCancelled ? `${refundStatus}. Refund will be credited to ${selectedOrder.payment_method || 'your payment account'}.` : 'Delivery partner will be assigned after packing is completed.'}</span></p>
                </div>
              )}
              <button onClick={() => setShowAllUpdates((value) => !value)}>
                {showAllUpdates ? 'Hide Updates' : 'See All Updates'} <ArrowLeft size={14} />
              </button>
            </div>

            <button className="fk-chat-strip" onClick={() => setSupportOpen((value) => !value)}><MessageCircle size={20} /> Chat with us</button>
            {supportOpen && (
              <div className="fk-support-panel">
                <h3>Customer Support</h3>
                <p><b>Order support:</b> Our support team can help with delivery updates, invoice queries, cancellation requests, and payment confirmation.</p>
                <div>
                  <span>1</span><strong>Ticket created</strong><small>Support request opened for this order.</small>
                </div>
                <div>
                  <span>2</span><strong>Order verification</strong><small>Payment, address, and order items verified.</small>
                </div>
                <div>
                  <span>3</span><strong>Customer support callback</strong><small>Expected within 24 hours if bank credit is delayed.</small>
                </div>
                <button type="button">Raise Support Ticket</button>
              </div>
            )}
            <div className="fk-order-id-strip">Order #OD{String(selectedOrder.id).padStart(16, '0')} <Copy size={14} /></div>
          </main>

          <aside>
            <div className="fk-side-card">
              <h3>Delivery details</h3>
              <p><Home size={15} /><b>Home</b> {selectedOrder.shipping_address}</p>
              <p><b>{selectedOrder.shipping_name}</b> {selectedOrder.shipping_phone}</p>
            </div>
            <div className="fk-side-card">
              <h3>Price details</h3>
              <p><span>Listing price</span><b>Rs. {Math.round(amount * 1.72).toLocaleString()}</b></p>
              <p><span>Special price</span><b>Rs. {Math.max(amount - 16, 0).toLocaleString()}</b></p>
              <p><span>Total fees</span><b>Rs. 16</b></p>
              <hr />
              <p className="total"><span>Total amount</span><b>Rs. {amount.toLocaleString()}</b></p>
              <div className="paid-by"><span>Paid By</span><b>{selectedOrder.payment_method}</b></div>
              {isCancelled && <div className="refund-status"><AlertTriangle size={14} /><span>{refundStatus}</span></div>}
            </div>
          </aside>
        </section>
      </div>
    );
  }

  return (
    <div className="fk-orders-page">
      <div className="fk-order-breadcrumb">Home &gt; My Account &gt; My Orders</div>
      <div className="fk-orders-layout">
        <aside className="fk-orders-filter">
          <h2>Filters</h2>
          <strong>ORDER STATUS</strong>
          {['All', 'Order placed', 'Delivered', 'Cancelled'].map((status) => (
            <label key={status}><input type="checkbox" checked={statusFilter === status} onChange={() => setStatusFilter(status)} /> {status}</label>
          ))}
          <strong>ORDER TIME</strong>
          {['Last 30 days', '2024', '2023', 'Older'].map((item) => <label key={item}><input type="checkbox" readOnly /> {item}</label>)}
        </aside>

        <main>
          <form className="fk-order-search" onSubmit={(e) => e.preventDefault()}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your orders here" />
            <button><Search size={16} /> Search Orders</button>
          </form>

          <div className="fk-order-list">
            {visibleOrders.map((order) => (
              <article key={order.id} onClick={() => setSelectedOrderId(order.id)}>
                <img src={order.firstItem?.image_url || 'https://via.placeholder.com/90'} alt={order.firstItem?.name || 'Order product'} />
                <div>
                  <h3>{order.firstItem?.name || `Order #${order.id}`}</h3>
                  <p>Color: {order.firstItem?.color || 'Black'}</p>
                </div>
                <strong>Rs. {parseInt(order.final_amount || 0).toLocaleString()}</strong>
                <aside>
                  <b className={order.status === 'Cancelled' ? 'cancelled' : 'placed'}>{order.statusText}</b>
                  <p>{order.status === 'Cancelled' ? `Refund status: ${order.refund_status || 'Refund processing'}.` : `Payment ${order.payment_status || 'Paid'} via ${order.payment_method}. Delivery update will appear soon.`}</p>
                </aside>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderHistory;
