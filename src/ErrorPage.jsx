import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css";

function ErrorPage() {
  return (
    <div className="error-page">
      <div className="error-container">

        <div className="error-code">404</div>

        <div className="error-icon">
          <span>!</span>
        </div>

        <h1>Oops! Page Not Found</h1>

        <p>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="error-buttons">
          <Link to="/" className="home-btn">
            ← Back to Home
          </Link>

          <button
            className="back-btn"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default ErrorPage;