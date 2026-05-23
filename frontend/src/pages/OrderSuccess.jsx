import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CheckCircle2,
  CheckSquare,
  MailCheck,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck
} from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderId] = useState(() => localStorage.getItem('lastPlacedOrderId') || 'N/A');
  const [orderNumber] = useState(() => localStorage.getItem('lastPlacedOrderNumber') || '');
  const [amount] = useState(() => localStorage.getItem('lastPlacedOrderAmount') || '0');
  const [firebaseSent] = useState(() => localStorage.getItem('lastOrderFirebaseSent') === 'true');
  const [firebaseFallback] = useState(() => localStorage.getItem('lastOrderFirebaseFallback') === 'true');
  const [firebaseMessageId] = useState(() => localStorage.getItem('lastOrderFirebaseMessageId') || '');
  const [emailTo] = useState(() => localStorage.getItem('lastOrderEmailTo') || '');
  const [emailSent] = useState(() => localStorage.getItem('lastOrderEmailSent') === 'true');
  const [emailFallback] = useState(() => localStorage.getItem('lastOrderEmailFallback') === 'true');
  const [dateString] = useState(() => new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    return () => {
      localStorage.removeItem('lastPlacedOrderId');
      localStorage.removeItem('lastPlacedOrderNumber');
      localStorage.removeItem('lastPlacedOrderAmount');
      localStorage.removeItem('lastOrderFirebaseSent');
      localStorage.removeItem('lastOrderFirebaseFallback');
      localStorage.removeItem('lastOrderFirebaseMessageId');
      localStorage.removeItem('lastOrderEmailTo');
      localStorage.removeItem('lastOrderEmailSent');
      localStorage.removeItem('lastOrderEmailFallback');
    };
  }, []);

  const displayOrderId = orderNumber || `FK-${orderId}`;
  const paidAmount = Number(amount || 0);

  return (
    <div className="order-success-page">
      <section className="fk-success-shell animate-slide-up">
        <div className="fk-success-hero">
          <div className="fk-success-check">
            <CheckCircle2 size={42} />
          </div>
          <div>
            <span>Order confirmed</span>
            <h1>Thank you for shopping with Flipkart</h1>
            <p>Your payment is approved and your order is now being prepared for dispatch.</p>
          </div>
        </div>

        <div className="fk-success-grid">
          <main className="fk-success-main">
            <div className="fk-success-card fk-order-id-card">
              <div>
                <CheckSquare size={18} />
                <span>Order ID</span>
              </div>
              <strong>#{displayOrderId}</strong>
              <p>Keep this ID handy for tracking, support and refund requests.</p>
            </div>

            <div className="fk-success-card fk-timeline-card">
              <h2>Order status</h2>
              <div className="fk-confirm-timeline">
                <div className="done">
                  <span><CheckCircle2 size={14} /></span>
                  <p><b>Order placed</b><small>{dateString}</small></p>
                </div>
                <div className="active">
                  <span><PackageCheck size={14} /></span>
                  <p><b>Seller processing</b><small>Packing and invoice generation started</small></p>
                </div>
                <div>
                  <span><Truck size={14} /></span>
                  <p><b>Delivery update</b><small>Tracking details will appear in My Orders</small></p>
                </div>
              </div>
            </div>

            <div className="fk-success-card fk-notify-card">
              <h2>Updates sent</h2>
              <div className="fk-notify-list">
                <p>
                  <MailCheck size={16} />
                  {emailTo
                    ? emailSent
                      ? `Invoice sent to ${emailTo}`
                      : emailFallback
                        ? `Email simulated for ${emailTo}`
                        : `Email prepared for ${emailTo}`
                    : 'Invoice will be available in order history'}
                </p>
                {(firebaseSent || firebaseFallback) && (
                  <p>
                    <Bell size={16} />
                    {firebaseSent
                      ? `Push notification sent${firebaseMessageId ? ` (${firebaseMessageId})` : ''}`
                      : 'Push notification simulated'}
                  </p>
                )}
                <p><ShieldCheck size={16} /> Safe payments, easy cancellation before shipment and secure refunds.</p>
              </div>
            </div>
          </main>

          <aside className="fk-success-side">
            <div className="fk-success-card fk-paid-card">
              <span>Total amount paid</span>
              <strong>Rs. {paidAmount.toLocaleString()}</strong>
              <p><Calendar size={15} /> Paid successfully on {dateString}</p>
              <p><ShoppingBag size={15} /> Your order is saved in My Orders</p>
            </div>

            <div className="fk-success-actions">
              <button onClick={() => navigate('/orders')}>View My Orders</button>
              <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
