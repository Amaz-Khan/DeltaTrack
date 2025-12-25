import { NavLink, useLocation } from "react-router-dom";
import { Button } from "antd";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div
      style={{
        height: 64,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e5e7eb",
        background: "#f5f7fa",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo / Product Name */}
      <div style={{ fontWeight: 600, fontSize: 18, marginLeft: 100 }}>
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 20,
            color: "#111827",
          }}
        >
          DeltaTrack
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* <NavLink
          to="/about"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#4f46e5" : "#374151",
            fontWeight: isActive ? 600 : 500,
          })}
        >
          About
        </NavLink> */}

        {path !== "/login" && (
          <NavLink to="/login" style={{ textDecoration: "none" }}>
            <Button type="primary" size="large">
              Login
            </Button>
          </NavLink>
        )}

        {path !== "/signup" && (
          <NavLink to="/signup" style={{ textDecoration: "none" }}>
            <Button size="large">Signup</Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
