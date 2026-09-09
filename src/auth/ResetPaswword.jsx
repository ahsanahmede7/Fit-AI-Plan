import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { supabase } from "../supabase/supabase";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Password empty check
    if (!password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    // Password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Password updated successfully!");

      // Login page par redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">

      <div className="reset-card">

        <h1>Reset Password</h1>

        <p className="reset-description">
          Enter your new password below.
        </p>

        <form onSubmit={handleResetPassword}>

          {/* New Password */}
          <div className="input-group">

            <label>
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>


          {/* Confirm Password */}
          <div className="input-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

          </div>


          {/* Error */}
          {error && (
            <p className="error">
              {error}
            </p>
          )}


          {/* Success */}
          {message && (
            <p className="success">
              {message}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>

        </form>


        <button
          className="back-login"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;
