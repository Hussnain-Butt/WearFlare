import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// --- Layouts ---
import DashboardLayout from './admin/layout/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'

// --- Core Components ---
import ProtectedRoute from './components/ProtectedRoute.jsx' // Ensure .jsx is correct or change to .tsx
import ThemeSwitcher from './components/ThemeSwitcher' // Ensure correct extension, probably .tsx

// --- Public Pages ---
import Index from './pages/Index'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ContactUs from './components/ContactUs'
import Men from './pages/Men'
import Women from './pages/Women'
import Cart from './pages/Cart'
import WishList from './pages/WishList'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TryOnPage from './pages/TryOnPage'
import CheckoutPage from './pages/CheckoutPage'

// --- Role-Specific Login Pages ---
import AdminLogin from './admin/pages/AdminLogin'
import ProductManagerLogin from './product-manager/pages/ProductManagerLogin.jsx' // Ensure .jsx is correct

// --- Admin Pages ---
import AdminDashboard from './admin/pages/AdminDashboard'
import Users from './admin/pages/Users'

// --- Shared/Reused Pages (Admin & PM) ---
import Products from './admin/pages/Products'
import OrdersPage from './admin/pages/OrdersPage'

// --- Other Pages ---
import { Account } from './pages/Account'
import OrderConfirmationStatusPage from './pages/OrderConfirmationStatusPage.js' // Ensure .js is correct
import TermsAndConditionsPage from './pages/TermsAndConditionsPage.js' // Ensure .js is correct
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.js' // Ensure .js is correct
// import NotFoundPage from './pages/NotFoundPage'; // Example for 404

const App = () => (
  // Outermost div to apply global theme background and text color
  <div className="flex flex-col min-h-screen bg-background text-foreground">
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
        </Route>

        {/* --- Role-Specific Login Routes (No Public Navbar/Footer) --- */}
        {/* These routes will also inherit the bg-background from the outermost div */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/pm/login" element={<ProductManagerLogin />} />

        {/* --- Admin Protected Routes (Uses DashboardLayout) --- */}
        {/* DashboardLayout should handle its own internal background if different from global */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        {/* --- Product Manager Protected Routes (Uses ProductManagerLayout) --- */}
        {/* ProductManagerLayout should handle its own internal background if different */}
        {/* <Route
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
        </Route> */}

        {/* --- Catch-all / 404 Route --- */}
        {/* For a 404 page that uses PublicLayout: */}
        {/* <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
           </Route>
        */}
        {/* For a standalone 404 page (will still get the global bg-background): */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
    {/* ThemeSwitcher can be here or inside PublicLayout, depending on where you want it */}
    <ThemeSwitcher />
  </div>
)

export default App
