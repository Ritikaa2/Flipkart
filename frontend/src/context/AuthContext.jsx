import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Restore session if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        console.error("Session restore failed, token expired:", err.message);
        // Clean expired token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: loggedUser } = response.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(loggedUser);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Register/Signup handler
  const register = async (name, email, password, phone, address) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, phone, address });
      const { token: receivedToken, user: registeredUser } = response.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      return { success: true };
    } catch (err) {
      console.error("Registration failed:", err);
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Send password reset OTP handler
  const sendResetOtp = async (email) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/send-reset-otp', { email });
      return {
        success: true,
        message: response.data?.message || 'OTP sent successfully to your registered email.'
      };
    } catch (err) {
      console.error("Send reset OTP failed:", err);
      const errMsg = err.response?.data?.message || 'Unable to send OTP. Please try again.';
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const forgotPassword = async (email, otp, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email, otp, password });
      return {
        success: true,
        message: response.data?.message || 'Password updated successfully. Please login with your new password.'
      };
    } catch (err) {
      console.error("Password reset failed:", err);
      const errMsg = err.response?.data?.message || 'Password reset failed. Please try again.';
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        sendResetOtp,
        forgotPassword,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
