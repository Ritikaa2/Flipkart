import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, ShoppingBag, Calendar, CheckSquare, MailCheck } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderId] = useState(() => localStorage.getItem('lastPlacedOrderId') || 'N/A');
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
    // Cleanup cached keys on unmount to keep state pure
    return () => {
      localStorage.removeItem('lastPlacedOrderId');
      localStorage.removeItem('lastPlacedOrderAmount');
      localStorage.removeItem('lastOrderFirebaseSent');
      localStorage.removeItem('lastOrderFirebaseFallback');
      localStorage.removeItem('lastOrderFirebaseMessageId');
      localStorage.removeItem('lastOrderEmailTo');
      localStorage.removeItem('lastOrderEmailSent');
      localStorage.removeItem('lastOrderEmailFallback');
    };
  }, []);

  return (
    <div className="order-success-page container mx-auto px-4 max-w-[1248px] py-12 flex justify-center items-center font-sans">
      {/* Success Card Wrapper */}
      <div className="bg-white p-10 rounded-[4px] shadow-modal max-w-[550px] w-full text-center border border-gray-150 animate-slide-up">
        
        {/* Animated Green Circle */}
        <div className="h-16 w-16 bg-green-50 text-flipkart-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
          <CheckCircle2 size={40} className="stroke-[2.5] animate-pulse" />
        </div>

        {/* Header Title */}
        <h2 className="text-[24px] font-extrabold text-flipkart-dark tracking-tight">Order Placed Successfully!</h2>
        <p className="text-[13.5px] text-flipkart-textGray mt-1 font-semibold">
          Your transaction is approved. Thank you for shopping with Flipkart!
        </p>

        {/* Invoice Summary Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-[4px] p-5 my-6 space-y-4 text-left text-[13.5px]">
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
            <span className="text-flipkart-textGray font-semibold flex items-center gap-1.5"><CheckSquare size={15} /> Order Reference ID:</span>
            <span className="font-extrabold text-flipkart-blue font-mono">#FK-{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-flipkart-textGray font-semibold flex items-center gap-1.5"><Calendar size={15} /> Purchase Date:</span>
            <span className="font-bold text-gray-700">{dateString}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-flipkart-textGray font-semibold flex items-center gap-1.5"><ShoppingBag size={15} /> Total Amount Paid:</span>
            <span className="font-extrabold text-flipkart-dark text-[15px]">₹{parseInt(amount).toLocaleString()}</span>
          </div>

          <div className="text-[11.5px] bg-green-50/50 text-flipkart-green border border-green-200/50 p-2.5 rounded text-center font-bold">
            An email invoice containing shipping updates and tracking links has been fired.
          </div>

          {emailTo && (
            <div className="text-[11.5px] bg-green-50 text-flipkart-green border border-green-200 p-2.5 rounded text-center font-bold flex items-center justify-center gap-1.5">
              <MailCheck size={14} />
              {emailSent
                ? `Complete order details sent to registered email ${emailTo}.`
                : emailFallback
                  ? `Email simulated for ${emailTo}. Check backend terminal or SMTP settings.`
                  : `Email prepared for ${emailTo}.`}
            </div>
          )}

          {(firebaseSent || firebaseFallback) && (
            <div className="text-[11.5px] bg-blue-50 text-flipkart-blue border border-blue-100 p-2.5 rounded text-center font-bold flex items-center justify-center gap-1.5">
              <Bell size={14} />
              {firebaseSent
                ? `Firebase order notification sent successfully${firebaseMessageId ? ` (${firebaseMessageId})` : ''}.`
                : 'Firebase order notification simulated. Add Firebase service account and device token in backend .env to send real push notification.'}
            </div>
          )}
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 select-none">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 border border-flipkart-blue text-flipkart-blue font-bold py-3 rounded-[2px] transition hover:bg-blue-50 text-[13px] uppercase tracking-wide"
          >
            View Order History
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-flipkart-blue hover:bg-blue-700 text-white font-bold py-3 rounded-[2px] transition text-[13px] uppercase tracking-wide shadow-sm"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
