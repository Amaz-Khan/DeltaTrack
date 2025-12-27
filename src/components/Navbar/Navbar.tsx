import { NavLink, useLocation } from "react-router-dom";
import { Button } from "antd";
import "./Navbar.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="navbar">
      {/* Logo / Product Name */}
      <div className="logoWrapper">
        <NavLink to="/" className="logoLink">
          DeltaTrack
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="navActions">
        {path !== "/login" && (
          <NavLink to="/login" className="noDecoration">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              Login
            </Button>
          </NavLink>
        )}

        {path !== "/signup" && (
          <NavLink to="/signup" className="noDecoration">
            <Button size="large" icon={<CheckCircleOutlined />}>
              Signup
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
