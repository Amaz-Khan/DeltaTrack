import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerContainer">
        <p className="footerText">
          All content on this website is proprietary and either owned or
          licensed by DeltaTrack.
          <br />
          Unauthorized use of any trademarks or materials from this site is
          strictly prohibited. All rights reserved.
          <br />© {new Date().getFullYear()} DeltaTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
