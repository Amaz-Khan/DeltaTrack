import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./Hero.css";
import { CheckCircleOutlined } from "@ant-design/icons";

const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className={`hero ${animate ? "animate" : ""}`}>
        <p className="heroTagline">DeltaTrack – JavaScript Error Monitoring</p>
        <h1 className="heroTitle">Catch Bugs Before They Impact User</h1>
        <p className="heroDescription">
          DeltaTrack continuously monitors your application for JavaScript
          errors in real time and automatically captures rich execution context,
          including full stack traces, source-mapped code, browser and device
          information, user sessions, and runtime environment details. <br />
          This allows your engineering team to understand not just what went
          wrong, but why it happened and who it affected before users experience
          disruption. By providing instant alerts and actionable insights,
          DeltaTrack eliminates the need to rely on delayed customer reports or
          manual log inspection.
        </p>
        <div className="heroButton">
        <Link to="/signup">
          <Button type="primary" size="large" icon={<CheckCircleOutlined  />}>
            Get Started
          </Button>
        </Link>
        </div>
        <p className="heroNote">Try it free, no credit card required.</p>
      </div>
    </>
  );
};

export default Hero;
