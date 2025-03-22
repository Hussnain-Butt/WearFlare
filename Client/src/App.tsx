
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ContactUs from "./components/ContactUs";
import VirtualFittingRoom from "./components/VirtualFittingRoom";
import VirtualFittingRoomCreation from "./components/VirtualFittingRoomCreation";
import ThreeDAvatarCustomization from "./components/ThreeDAvatarCustomization";
import NavbarComponent from "./components/NavbarComponent";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/navbar" element={<NavbarComponent />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/virtual-fitting-room" element={<VirtualFittingRoom />} />
      <Route path="/virtual-fitting-room-creation" element={<VirtualFittingRoomCreation />} />
      <Route path="/3d-avatar-customization" element={<ThreeDAvatarCustomization />} />
    </Routes>
  </Router>
);

export default App;
