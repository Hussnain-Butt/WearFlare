import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// --- Layouts ---
import DashboardLayout from './admin/layout/DashboardLayout' // Admin Layout
// Explicitly add .jsx extension if the file is ProductManagerLayout.jsx
import ProductManagerLayout from './product-manager/layout/ProductManagerLayout.jsx' // PM Layout

// --- Core Components ---
import NavbarComponent from './components/NavbarComponent'
import Footer from './components/Footer'
// Assuming ProtectedRoute.js (or .jsx/.tsx) - keep extension off unless needed
import ProtectedRoute from './components/ProtectedRoute.jsx'

// --- Public Pages ---
import Index from './pages/Index'
import LoginForm from './components/LoginForm' // Customer Login
import SignupForm from './components/SignupForm'
import ContactUs from './components/ContactUs'
import Men from './pages/Men'
import Women from './pages/Women'
import Cart from './pages/Cart'
import Shop from './pages/Shop'
import WishList from './pages/WishList'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TryOnPage from './pages/TryOnPage'
import CheckoutPage from './pages/CheckoutPage'
// --- End Public Pages ---

// --- Role-Specific Login Pages ---
import AdminLogin from './admin/pages/AdminLogin'
// Explicitly add .jsx extension if the file is ProductManagerLogin.jsx
import ProductManagerLogin from './product-manager/pages/ProductManagerLogin.jsx'
// --- End Login Pages ---

// --- Admin Pages ---
import AdminDashboard from './admin/pages/AdminDashboard'
import Users from './admin/pages/Users'
// --- End Admin Pages ---

// --- Shared/Reused Pages (Admin & PM) ---
// Assuming these are .tsx or .jsx files
import Products from './admin/pages/Products'
import OrdersPage from './admin/pages/OrdersPage'
// --- End Shared Pages ---

// --- Other Pages ---
import { Account } from './pages/Account' // Customer Account
import OrderConfirmationStatusPage from './pages/OrderConfirmationStatusPage.js'
// --- End Other Pages ---

const App = () => (
  <Router>
    {/* Consider moving Navbar/Footer into specific layouts or rendering conditionally */}
    <NavbarComponent />

    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/try-on/:productId" element={<TryOnPage />} />
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/order-confirmation-status" element={<OrderConfirmationStatusPage />} />
      <Route path="/cart" element={<Cart />} />
      {/* <Route path="/shop" element={<Shop />} /> */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/wishlist" element={<WishList />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* --- Customer Account Route (Example Protection) --- */}
      <Route
        path="/account"
        element={
          <ProtectedRoute allowedRoles={['customer']} loginPath="/login">
            <Account />
          </ProtectedRoute>
        }
      />

      {/* --- Role-Specific Login Routes --- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/pm/login" element={<ProductManagerLogin />} />

      {/* --- Admin Protected Routes --- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

      {/* --- Product Manager Protected Routes --- */}
      <Route
        path="/pm"
        element={
          <ProtectedRoute allowedRoles={['productManager']} loginPath="/pm/login">
            <ProductManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

      {/* --- Catch-all / 404 Route --- */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>

    <Footer />
  </Router>
)

export default App
