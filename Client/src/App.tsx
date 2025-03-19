
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ContactUs from "./components/ContactUs";
import VirtualFittingRoom from "./components/VirtualFittingRoom";
import Navbar from "./components/Navbar";
 

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/virtualroom" element={<VirtualFittingRoom />} />
      <Route path="/navbar" element={<Navbar />} />
    </Routes>
  </Router>
);

export default App;
