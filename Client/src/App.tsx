
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ContactUs from "./components/ContactUs";
import VirtualFittingRoom from "./components/VirtualFittingRoom";
import VirtualFittingRoomCreation from "./components/VirtualFittingRoomCreation";
import ThreeDAvatarCustomization from "./components/ThreeDAvatarCustomization";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import Men from "./pages/Men";
import Women from "./pages/Women";
import { Account } from "./pages/Account";
import WishList from "./pages/WishList";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
const App = () => (
  <Router>
    <NavbarComponent />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/virtual-fitting-room" element={<VirtualFittingRoom />} />
      <Route path="/virtual-fitting-room-creation" element={<VirtualFittingRoomCreation />} />
      <Route path="/3d-avatar-customization" element={<ThreeDAvatarCustomization />} />
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/account" element={<Account />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/wishlist" element={<WishList />} />
    </Routes>
    <Footer/>
  </Router>
);

export default App;
