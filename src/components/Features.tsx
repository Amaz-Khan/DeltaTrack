const Features = () => {
  return (
    <div
      style={{
        padding: "60px 40px",
        background: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 40,
            color: "#111827",
          }}
        >
          Why developers choose DeltaTrack?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 32,
          }}
        >
          <div className="feature-card">
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: "#111827",
              }}
            >
              Real-time error tracking
            </h3>
            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Get instant notifications of JavaScript errors as they occur in
              production, allowing you to address issues before they impact your
              users.
            </p>
          </div>

          <div className="feature-card">
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: "#111827",
              }}
            >
              Actionable Insights
            </h3>
            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Understand exactly what went wrong and where, without digging
              through logs.
            </p>
          </div>

          <div className="feature-card">
          
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: "#111827",
              }}
            >
              Built for Developers
            </h3>
            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Lightweight, fast, and easy to integrate into any modern frontend
              stack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
