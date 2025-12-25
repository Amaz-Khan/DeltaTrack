import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";


const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`hero ${animate ? "animate" : ""}`}
      style={{ maxWidth: 1250, 
        margin: "0 auto", 
        padding: "80px 1px", 
        backgroundImage: "url('/hero_bkg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 0,

   }}
    >
        
      <p
        style={{
          fontSize: 18,
          color: "#6b7280",
          maxWidth: 600,
          marginBottom: 32,
        }}
      >
        DeltaTrack – JavaScript Error Monitoring
      </p>

      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 16,
        }}
      >
        Catch Bugs Before They Impact User
      </h1>

      <p
        style={{
          fontSize: 18,
          color: "#6b7280",
          maxWidth: 750,
          marginBottom: 32,
        }}
      >
        DeltaTrack automatically identifies JavaScript errors and provides
        detailed context on how they occurred, enabling you to resolve critical
        issues before your users even notice.
        <br/>Stop relying on customer
        reports start fixing problems proactively.
      </p>

      <Link to="/signup">
        <Button type="primary" size="large">
          Get Started
        </Button>
      </Link>

      <p
        style={{
          fontSize: 18,
          color: "#6b7280",
          maxWidth: 600,
          marginTop: 16,
          marginBottom: 32,
        }}
      >
        Try it free, no credit card required.
      </p>
    </div>
  );
};

export default Hero;
