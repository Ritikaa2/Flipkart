import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  ArrowLeft,
  BadgeCheck,
  Gift,
  KeyRound,
  LogIn,
  MailCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserPlus,
  WalletCards
} from 'lucide-react';

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

  const {
    login,
    register,
    sendResetOtp,
    forgotPassword,
    isAuthenticated
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    // FORGOT PASSWORD
    if (isForgotPassword) {

      // SEND OTP
      if (!otpSent) {

        if (!email) {
          setError('Please enter your registered email address.');
          setLoading(false);
          return;
        }

        const result = await sendResetOtp(email);

        if (result.success) {

          setOtpSent(true);

          setSuccess(
            result.message || 'OTP sent successfully to your email.'
          );

        } else {

          setError(
            result.error || 'Failed to send OTP email.'
          );
        }

        setLoading(false);
        return;
      }

      // VERIFY OTP
      if (
        !email ||
        !otp ||
        !password ||
        !confirmPassword
      ) {

        setError(
          'Please enter email, OTP, new password, and confirm password.'
        );

        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {

        setError(
          'New password and confirm password do not match.'
        );

        setLoading(false);
        return;
      }

      // RESET PASSWORD
      const result = await forgotPassword(email, otp, password);

      if (result.success) {

        setSuccess(
          'Password updated successfully. Please login with your new password.'
        );

        setPassword('');
        setConfirmPassword('');
        setOtp('');

        setOtpSent(false);

        setIsForgotPassword(false);
        setIsLogin(true);

      } else {

        setError(result.error);
      }

    }

    // LOGIN
    else if (isLogin) {

      const result = await login(email, password);

      if (!result.success) {
        setError(result.error);
      }

    }

    // REGISTER
    else {

      if (!name || !email || !password) {

        setError(
          'Please fill in Name, Email, and Password fields.'
        );

        setLoading(false);
        return;
      }

      const result = await register(
        name,
        email,
        password,
        phone,
        address
      );

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
              {isForgotPassword
                ? 'Account recovery'
                : isLogin
                  ? 'Welcome back'
                  : 'Join Flipkart'}
            </span>

            <h2>
              {isForgotPassword
                ? 'Reset your Flipkart password'
                : isLogin
                  ? 'Login to your shopping world'
                  : 'Create your Flipkart account'}
            </h2>

            <p>
              {isForgotPassword
                ? 'Enter the OTP sent to your email and set a new password.'
                : isLogin
                  ? 'Track orders, manage wishlist and checkout faster.'
                  : 'Create your account and enjoy shopping.'}
            </p>

          </div>

          <div className="auth-side-points">

            <span className="flex items-center gap-2">
              <ShoppingBag size={14} />
              Genuine products
            </span>

            <span className="flex items-center gap-2">
              <Truck size={14} />
              Fast delivery
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={14} />
              Secure payments
            </span>

            <span className="flex items-center gap-2">
              <Gift size={14} />
              Exclusive offers
            </span>

          </div>

        </aside>

        <section className="auth-form-panel">

          <div className="auth-heading">

            <span>
              {isForgotPassword
                ? 'Recover your account'
                : isLogin
                  ? 'Secure account access'
                  : 'Start shopping smarter'}
            </span>

            <h1>
              {isForgotPassword
                ? 'Forgot password'
                : isLogin
                  ? 'Sign in'
                  : 'Sign up'}
            </h1>

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

                  <label>
                    {isForgotPassword
                      ? 'New Password'
                      : 'Password'}
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />

                </div>
              )}

              {isForgotPassword && otpSent && (
                <>
                  <div className="auth-field">

                    <label>Email OTP</label>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter OTP"
                      required
                    />

                  </div>

                  <div className="auth-field">

                    <label>Confirm Password</label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm password"
                      required
                    />

                  </div>
                </>
              )}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >

              {loading
                ? 'Loading...'
                : isForgotPassword
                  ? otpSent
                    ? 'Update Password'
                    : 'Send OTP'
                  : isLogin
                    ? 'Login'
                    : 'Register'}

            </button>

          </form>

          {isLogin && !isForgotPassword && (

            <button
              type="button"
              onClick={() => switchAuthMode('forgot')}
              className="auth-link-button"
            >
              Forgot Password?
            </button>

          )}

          <div className="auth-switch">

            {isForgotPassword ? (

              <span
                onClick={() => switchAuthMode('login')}
              >
                <ArrowLeft size={16} />
                Back to Login
              </span>

            ) : isLogin ? (

              <span
                onClick={() => switchAuthMode('signup')}
              >
                Create New Account
              </span>

            ) : (

              <span
                onClick={() => switchAuthMode('login')}
              >
                Already have an account?
              </span>

            )}

          </div>

        </section>

      </div>

    </div>
  );
};

export default AuthPage;
