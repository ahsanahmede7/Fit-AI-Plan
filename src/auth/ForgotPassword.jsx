import { useState } from "react";
import "./ForgotPassword.css";
import { supabase } from "../supabase/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: "http://localhost:5173/reset-password",
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setMessage(
        "Password reset link has been sent to your email."
      );

      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Forgot Password?</h1>

        <p className="description">
          Enter your email and we will send you a password reset link.
        </p>

        <form onSubmit={handleForgotPassword}>
          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {message && (
            <p className="success">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <a href="/login" className="back-login">
          ← Back to Login
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;
