import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupVerify from "./pages/SignupVerify";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Test from "./pages/Test";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Errors from "./pages/Dashboard/Errors";
import Setup from "./pages/Dashboard/Setup";
import Settings from "./pages/Dashboard/Settings";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-verify/*" element={<SignupVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/test" element={<Test />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="errors" element={<Errors />} />
          <Route path="setup" element={<Setup />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
