import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            
            {/* App Main Layout Structure */}
            <div className="app-shell flex flex-col min-h-screen bg-flipkart-bg">
              
              {/* Sticky Navbar */}
              <Navbar />

              {/* Main Content Area */}
              <main className="app-main flex-grow pb-8">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Protected/Private routes */}
                  <Route
                    path="/checkout"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <PrivateRoute>
                        <OrderSuccess />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <OrderHistory />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <PrivateRoute>
                        <Wishlist />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/account/:section?"
                    element={
                      <PrivateRoute>
                        <AccountPage />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>

              {/* Classic Footer */}
              <Footer />

            </div>

          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
