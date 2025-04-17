import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ContactUs from './components/ContactUs'

import ThreeDAvatarCustomization from './components/ThreeDAvatarCustomization'
import NavbarComponent from './components/NavbarComponent'
import Footer from './components/Footer'
import Men from './pages/Men'
import Women from './pages/Women'
import { Account } from './pages/Account'
import WishList from './pages/WishList'
import Cart from './pages/Cart'
import Shop from './pages/Shop'
import AdminLogin from '../src/admin/pages/AdminLogin'
import AdminDashboard from '../src/admin/pages/AdminDashboard'
import Users from '../src/admin/pages/Users'
import Products from './admin/pages/Products'

import DashboardLayout from '../src/admin/layout/DashboardLayout' // Admin Dashboard Layout
import TryOnPage from './pages/TryOnPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './admin/pages/OrdersPage'
import ManagerProducts from './ProductManager/pages/ManagerProducts'
import ManagerLogin from './ProductManager/pages/ManagerLogin.jsx'
import ManagerDashboardLayout from './ProductManager/layout/ManagerDashboardLayout.jsx'

const App = () => (
  <Router>
    <NavbarComponent />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/try-on/:productId" element={<TryOnPage />} />
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/account" element={<Account />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      <Route path="/wishlist" element={<WishList />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin Dashboard with Layout */}
      <Route path="/admin/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

      {/* --- Product Manager Routes --- */}
      <Route path="/productmanager" element={<ManagerLogin />} />
      {/* Use a specific Manager Layout */}
      <Route path="/productmanager/*" element={<ManagerDashboardLayout />}>
        {/* Make ManagerProducts the index AND specific path */}
        <Route index element={<ManagerProducts />} />
        <Route path="products" element={<ManagerProducts />} />
        {/* Add other manager-specific routes here if needed */}
      </Route>
    </Routes>
    <Footer />
  </Router>
)

export default App
