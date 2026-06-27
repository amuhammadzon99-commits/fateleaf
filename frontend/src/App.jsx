import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import ProductScreen from './pages/ProductScreen';
import About from './pages/About';
import Delivery from './pages/Delivery';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Contacts from './pages/Contacts';
import GiftConstructor from './pages/GiftConstructor';
import AIAssistant from './components/AIAssistant';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';

import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStats from './pages/admin/AdminStats';
import AdminSettings from './pages/admin/AdminSettings';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gift" element={<GiftConstructor />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
      <AIAssistant />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <AppContent />
    </Router>
  );
}

export default App;
