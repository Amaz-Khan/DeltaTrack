import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';

const App = () => {
  return (
   <Routes>
    <Route path="/" element={<Navigate to="/about" replace />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
   </Routes> 
  );
};

export default App;