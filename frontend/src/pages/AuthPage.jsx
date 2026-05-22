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
    <div className="auth-page">
      <div className="auth-card">
        <aside className="auth-side">
          <div>
            <span>
              {isForgotPassword ? 'Account recovery' : isLogin ? 'Welcome back' : 'Join Flipkart'}
            </span>
            <h2>
              {isForgotPassword ? 'Reset your Flipkart password' : isLogin ? 'Login to your shopping world' : "Create your Flipkart account"}
            </h2>
            <p>
              {isForgotPassword
                ? 'Enter the OTP sent to your email and set a new password to get back to your orders and offers.'
                : isLogin
                ? 'Track orders, manage your wishlist, unlock personal offers, and checkout faster.'
                : 'Save addresses, build your wishlist, get faster checkout, and discover better deals.'}
            </p>
          </div>

          <div className="auth-side-points">
            <span className="flex items-center gap-2"><ShoppingBag size={14} className="text-flipkart-yellow" /> 100% genuine products</span>
            <span className="flex items-center gap-2"><Truck size={14} className="text-flipkart-yellow" /> Fast delivery updates</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-flipkart-yellow" /> Secure payments</span>
            <span className="flex items-center gap-2"><Gift size={14} className="text-flipkart-yellow" /> Member-only deals</span>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-heading">
            <span>
              {isForgotPassword ? 'Recover your account' : isLogin ? 'Secure account access' : 'Start shopping smarter'}
            </span>
            <h1>
              {isForgotPassword ? 'Forgot password' : isLogin ? 'Sign in' : 'Sign up'}
            </h1>
            <p>
              {isForgotPassword
                ? otpSent
                  ? 'Enter the 6-digit OTP from your email and create a fresh password.'
                  : 'Use the email linked to your Flipkart account to receive a reset OTP.'
                : isLogin
                ? 'Use your registered email and password.'
                : 'Fill in your details once and enjoy a faster checkout every time.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-alert error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-alert success">
                <MailCheck size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="auth-fields">
              {!isLogin && !isForgotPassword && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={isForgotPassword && otpSent}
                />
              </div>

              {(!isForgotPassword || otpSent) && (
                <div className="auth-field">
                  <label>{isForgotPassword ? 'New Password' : 'Password'}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isForgotPassword ? 'Enter new password' : 'Enter password'}
                    required
                  />
                  {!isLogin && !isForgotPassword && (
                    <p>Use 8+ characters with uppercase, lowercase, number and special character.</p>
                  )}
                </div>
              )}

              {isForgotPassword && (
                <>
                  {otpSent && (
                    <div className="auth-field">
                      <label>Email OTP</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        required
                      />
                    </div>
                  )}

                  {otpSent && (
                    <div className="auth-field">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {!isLogin && !isForgotPassword && (
                <>
                  <div className="auth-field">
                    <label>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>

                  <div className="auth-field">
                    <label>Delivery Address (Optional)</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter standard shipping address"
                    />
                  </div>
                </>
              )}
            </div>

            <p className="auth-policy">
              By continuing, you agree to Flipkart's <span className="text-flipkart-blue cursor-pointer hover:underline font-semibold">Terms of Use</span> and <span className="text-flipkart-blue cursor-pointer hover:underline font-semibold">Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
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
              className="auth-link-button"
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
              className="auth-link-button"
            >
              <MailCheck size={15} />
              Resend OTP
            </button>
          )}

          <div className="auth-trust-row">
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

          <div className="auth-switch">
            {isForgotPassword ? (
              <span
                onClick={() => switchAuthMode('login')}
              >
                <ArrowLeft size={16} /> Back to Login
              </span>
            ) : isLogin ? (
              <span
                onClick={() => switchAuthMode('signup')}
              >
                New to Flipkart? Create an account
              </span>
            ) : (
              <span
                onClick={() => switchAuthMode('login')}
              >
                Existing User? Log in to your account
              </span>
            )}
          </div>

        </section>
      </div>
    </div>
  );
};

export default AuthPage;
