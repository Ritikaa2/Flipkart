import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, BadgeCheck, Gift, KeyRound, LogIn, MailCheck, ShieldCheck, ShoppingBag, Truck, UserPlus, WalletCards } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, sendResetOtp, forgotPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isForgotPassword) {
      if (!otpSent) {
        if (!email) {
          setError('Please enter your registered email address.');
          setLoading(false);
          return;
        }

        const result = await sendResetOtp(email);
        if (result.success) {
          setOtpSent(true);
          setSuccess(result.message || 'OTP sent successfully to your registered email.');
        } else {
          setError(result.error);
        }
        setLoading(false);
        return;
      }

      if (!email || !otp || !password || !confirmPassword) {
        setError('Please enter email, OTP, new password, and confirm password.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('New password and confirm password do not match.');
        setLoading(false);
        return;
      }

      const result = await forgotPassword(email, otp, password);
      if (result.success) {
        setSuccess(result.message || 'Password updated successfully. Please login with your new password.');
        setPassword('');
        setConfirmPassword('');
        setOtp('');
        setOtpSent(false);
        setIsForgotPassword(false);
        setIsLogin(true);
      } else {
        setError(result.error);
      }
    } else if (isLogin) {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in Name, Email, and Password fields.');
        setLoading(false);
        return;
      }
      const result = await register(name, email, password, phone, address);
      if (!result.success) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const switchAuthMode = (mode) => {
    setIsLogin(mode === 'login');
    setIsForgotPassword(mode === 'forgot');
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setOtpSent(false);
  };

  return (
    <div className="auth-page min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="auth-card bg-white w-full max-w-[850px] min-h-[520px] rounded-[4px] shadow-modal overflow-hidden flex flex-col md:flex-row animate-slide-up">
        
        <div className="auth-visual bg-flipkart-blue md:w-[35%] p-10 text-white flex flex-col justify-between select-none shrink-0 min-h-[200px] md:min-h-auto">
          <div>
            <span className="auth-eyebrow">{isForgotPassword ? 'Account recovery' : isLogin ? 'Welcome back' : 'Join Flipkart'}</span>
            <h2 className="text-[28px] font-bold tracking-wide">
              {isForgotPassword ? 'Reset your Flipkart password' : isLogin ? 'Login to your shopping world' : "Create your Flipkart account"}
            </h2>
            <p className="text-[15px] font-medium text-blue-50 mt-4 leading-6">
              {isForgotPassword
                ? 'Enter the OTP sent to your email and set a new password to get back to your orders and offers.'
                : isLogin
                ? 'Track orders, manage your wishlist, unlock personal offers, and checkout faster.'
                : 'Save addresses, build your wishlist, get faster checkout, and discover better deals.'}
            </p>
          </div>

          <div className="auth-benefits hidden md:flex flex-col gap-4 text-blue-100/80 text-[12px] font-medium border-t border-blue-400/30 pt-6 mt-8">
            <span className="flex items-center gap-2"><ShoppingBag size={14} className="text-flipkart-yellow" /> 100% genuine products</span>
            <span className="flex items-center gap-2"><Truck size={14} className="text-flipkart-yellow" /> Fast delivery updates</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-flipkart-yellow" /> Secure payments</span>
            <span className="flex items-center gap-2"><Gift size={14} className="text-flipkart-yellow" /> Member-only deals</span>
          </div>
        </div>

        <div className="auth-form-panel flex-1 p-10 flex flex-col justify-between bg-white relative">
          <div className="auth-form-heading">
            <span>{isForgotPassword ? 'Recover your account' : isLogin ? 'Secure account access' : 'Start shopping smarter'}</span>
            <h1>{isForgotPassword ? 'Forgot password' : isLogin ? 'Sign in' : 'Sign up'}</h1>
            <p>
              {isForgotPassword
                ? otpSent
                  ? 'Enter the 6-digit OTP from your email and create a fresh password.'
                  : 'Use the email linked to your Flipkart account to receive a reset OTP.'
                : isLogin
                ? 'Use your registered email and password. Demo: demo@flipkart.com / demo12345'
                : 'Fill in your details once and enjoy a faster checkout every time.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Error Message alert banner */}
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded text-[13px] font-semibold animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success-message animate-fade-in">
                <MailCheck size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Inputs grid depending on state */}
            <div className="flex flex-col gap-5">
              {!isLogin && !isForgotPassword && (
                <div>
                  <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                  required
                  disabled={isForgotPassword && otpSent}
                />
              </div>

              {(!isForgotPassword || otpSent) && (
                <div>
                  <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">{isForgotPassword ? 'New Password' : 'Password'}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isForgotPassword ? 'Enter new password' : 'Enter password'}
                    className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                    required
                  />
                </div>
              )}

              {isForgotPassword && (
                <>
                  {otpSent && (
                    <div>
                      <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Email OTP</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                        required
                      />
                    </div>
                  )}

                  {otpSent && (
                    <div>
                      <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {!isLogin && !isForgotPassword && (
                <>
                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] text-gray-500 font-semibold uppercase block mb-1">Delivery Address (Optional)</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter standard shipping address"
                      className="w-full border-b-2 border-gray-200 focus:border-flipkart-blue outline-none py-1.5 text-[14px] font-medium transition-colors text-black bg-transparent"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Disclaimer text */}
            <p className="text-[12px] text-flipkart-textGray leading-relaxed font-medium mt-2">
              By continuing, you agree to Flipkart's <span className="text-flipkart-blue cursor-pointer hover:underline font-semibold">Terms of Use</span> and <span className="text-flipkart-blue cursor-pointer hover:underline font-semibold">Privacy Policy</span>.
            </p>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-flipkart-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-[2px] transition text-[15px] shadow-sm flex items-center justify-center gap-2"
              id="auth-submit-button"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : isForgotPassword ? (
                <>
                  {otpSent ? <KeyRound size={18} /> : <MailCheck size={18} />}
                  {otpSent ? 'Update Password' : 'Send OTP'}
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={18} /> Log In
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Sign Up
                </>
              )}
            </button>
          </form>

          {isLogin && !isForgotPassword && (
            <button
              type="button"
              onClick={() => switchAuthMode('forgot')}
              className="forgot-password-button"
            >
              <KeyRound size={15} />
              Forgot Password?
            </button>
          )}

          {isForgotPassword && otpSent && (
            <button
              type="button"
              onClick={async () => {
                setError('');
                setSuccess('');
                setLoading(true);
                const result = await sendResetOtp(email);
                if (result.success) {
                  setSuccess('New OTP sent successfully to your registered email.');
                } else {
                  setError(result.error);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="forgot-password-button"
            >
              <MailCheck size={15} />
              Resend OTP
            </button>
          )}

          <div className="auth-content-strip">
            <div>
              <BadgeCheck size={18} />
              <span>Verified sellers</span>
            </div>
            <div>
              <WalletCards size={18} />
              <span>Safe checkout</span>
            </div>
            <div>
              <Gift size={18} />
              <span>Fresh offers</span>
            </div>
          </div>

          {/* Toggle Login/Signup Trigger */}
          <div className="mt-8 text-center text-[14px] font-semibold text-flipkart-blue">
            {isForgotPassword ? (
              <span
                onClick={() => switchAuthMode('login')}
                className="cursor-pointer hover:underline select-none block bg-slate-50 border border-slate-100 py-3 rounded hover:bg-slate-100 transition"
              >
                <ArrowLeft size={16} /> Back to Login
              </span>
            ) : isLogin ? (
              <span
                onClick={() => switchAuthMode('signup')}
                className="cursor-pointer hover:underline select-none block bg-slate-50 border border-slate-100 py-3 rounded hover:bg-slate-100 transition"
              >
                New to Flipkart? Create an account
              </span>
            ) : (
              <span
                onClick={() => switchAuthMode('login')}
                className="cursor-pointer hover:underline select-none block bg-slate-50 border border-slate-100 py-3 rounded hover:bg-slate-100 transition"
              >
                Existing User? Log in to your account
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
