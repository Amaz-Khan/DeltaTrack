const Footer = () => {
  return (
    <div
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "32px 40px",
        background: "#ffffff",
        
      }}
    >
      <div
        style={{
          maxWidth: 750,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          minHeight: 40,
        }}
      >
        <p
              style={{
                color: "#6b7280",
                lineHeight: 1.6,
                margin: 0,
                justifyContent: "center",
                textAlign: "center",
              }}
            >
                All content on this website is proprietary and 
                either owned or licensed by DeltaTrack. 
                <br/>Unauthorized use of any trademarks or 
                materials from this site is strictly prohibited. 
                All rights reserved.
                <br/>
                        © {new Date().getFullYear()} DeltaTrack. All rights reserved.
            </p>

      </div>
    </div>
  );
};

export default Footer;
