import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// --- Layouts ---
import DashboardLayout from './admin/layout/DashboardLayout' // Admin Layout
import ProductManagerLayout from './product-manager/layout/ProductManagerLayout.jsx' // PM Layout
import PublicLayout from './layouts/PublicLayout' // NEW: Public Layout (adjust path if needed)

// --- Core Components ---
// NavbarComponent and Footer are now part of PublicLayout
// import NavbarComponent from './components/NavbarComponent'
// import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// --- Public Pages ---
import Index from './pages/Index'
import LoginForm from './components/LoginForm' // Customer Login
import SignupForm from './components/SignupForm'
import ContactUs from './components/ContactUs'
import Men from './pages/Men'
import Women from './pages/Women'
import Cart from './pages/Cart'
// import Shop from './pages/Shop' // Uncomment if you have it
import WishList from './pages/WishList'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TryOnPage from './pages/TryOnPage'
import CheckoutPage from './pages/CheckoutPage'
// --- End Public Pages ---

// --- Role-Specific Login Pages ---
import AdminLogin from './admin/pages/AdminLogin'
import ProductManagerLogin from './product-manager/pages/ProductManagerLogin.jsx'
// --- End Login Pages ---

// --- Admin Pages ---
import AdminDashboard from './admin/pages/AdminDashboard'
import Users from './admin/pages/Users'
// --- End Admin Pages ---

// --- Shared/Reused Pages (Admin & PM) ---
import Products from './admin/pages/Products' // Assuming this is used by both
import OrdersPage from './admin/pages/OrdersPage' // Assuming this is used by both
// --- End Shared Pages ---

// --- Other Pages ---
import { Account } from './pages/Account' // Customer Account
import OrderConfirmationStatusPage from './pages/OrderConfirmationStatusPage.js'
import TermsAndConditionsPage from './pages/TermsAndConditionsPage.js'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.js'
// import NotFoundPage from './pages/NotFoundPage'; // Example for 404
// --- End Other Pages ---

const App = () => (
  <Router>
    <Routes>
      {/* --- Routes with Public Navbar & Footer --- */}
      <Route element={<PublicLayout />}>
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
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRoles={['customer']} loginPath="/login">
              <Account />
            </ProtectedRoute>
          }
        />
        {/* Add other public pages here */}
      </Route>
      {/* --- Role-Specific Login Routes (No Public Navbar/Footer) --- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/pm/login" element={<ProductManagerLogin />} /> {/* Assuming you'll use this */}
      {/* --- Admin Protected Routes (Uses DashboardLayout, no Public Navbar/Footer) --- */}
      <Route
        path="/admin" // Parent route for admin section
        element={
          <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<OrdersPage />} />
        {/* Add other admin-specific nested routes here */}
      </Route>
      {/* --- Product Manager Protected Routes (Uses ProductManagerLayout, no Public Navbar/Footer) --- */}
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
        {/* Add other PM-specific nested routes here */}
      </Route>
      {/* --- Catch-all / 404 Route --- */}
      {/* It's good practice to have a 404 page.
          If you want it to have the public layout:
      */}
      {/* <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
         </Route>
      */}
      {/* Or if it's a standalone 404 page: */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  </Router>
)

export default App
