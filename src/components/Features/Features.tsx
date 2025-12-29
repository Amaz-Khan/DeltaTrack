import "./Features.css";

const Features = () => {
  return (
    <div className="featuresSection">
      <div className="featuresContainer">
        <h2 className="featuresTitle">Why developers choose DeltaTrack?</h2>

        <div className="featuresGrid">
          <div className="feature-card">
            <h3 className="featureTitle">Real-time error tracking</h3>
            <p className="featureDescription">
              Get instant notifications of JavaScript errors as they occur in
              production, allowing you to address issues before they impact your
              users.
            </p>
          </div>

          <div className="feature-card">
            <h3 className="featureTitle">Actionable Insights</h3>
            <p className="featureDescription">
              Understand exactly what went wrong and where, without digging
              through logs.
            </p>
          </div>

          <div className="feature-card">
            <h3 className="featureTitle">Built for Developers</h3>
            <p className="featureDescription">
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
