import React, { useState } from "react";
import "./Signup.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setFullName,
  setsignupPassword,
  setsignupUser,
} from "../redux/SingUpSlice";
import { useNavigate, Link } from "react-router-dom";
import { usersignup } from "../tanstack/APIcall";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.signup);

  const [Error, SetError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending } = usersignup();

  const click = (e) => {
    e.preventDefault();

    SetError(null);

    // Password validation
    if (data.Password !== confirmPassword) {
      SetError({
        message: "Passwords do not match",
      });
      return;
    }

    // Empty field validation
    if ( !data.user || !data.Password) {
      SetError({
        message: "Please fill all required fields",
      });
      return;
    }

    mutate(
      {
        email: data.user,
        password: data.Password,
      },
      {
        onSuccess: (response) => {
          console.log("Signup successful:", response);

          // Clear Redux state
          dispatch(setFullName(""));
          dispatch(setsignupUser(""));
          dispatch(setsignupPassword(""));

          // Go to login
          navigate("/login");
        },

        onError: (error) => {
          console.log("Signup error:", error);

          SetError(error);
        },
      }
    );
  };

  return (
    <div className="signup-page">

      {/* ================= NAVBAR ================= */}

      <header className="signup-navbar">

        <div className="brand">

          <div className="brand-icon">
            <span>+</span>
          </div>

          <span className="brand-name">
            FitPlan <span>AI</span>
          </span>

        </div>


        <nav className="navbar-links">

          <a href="/">Features</a>
          <a href="/">How It Works</a>
          <a href="/">Plans</a>
          <a href="/">About Us</a>
          <a href="/">Blog</a>

        </nav>


        <div className="navbar-actions">

          <button
            className="navbar-login"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <button className="navbar-start">
            Get Started
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="signup-main">

        {/* ================= LEFT SECTION ================= */}

        <section className="signup-left">

          <div className="signup-left-content">

            {/* Badge */}

            <div className="ai-badge">
              ✨ AI-Powered Fitness & Nutrition
            </div>


            {/* Heading */}

            <h1 className="signup-heading">

              Start Your
              <br />

              Fitness
              <br />

              <span>Transformation.</span>

            </h1>


            {/* Description */}

            <p className="signup-description">

              Create your free account and let AI build
              a personalized fitness and nutrition plan
              designed specifically for you.

            </p>


            {/* Benefits */}

            <div className="signup-benefits">

              {/* Benefit 1 */}

              <div className="signup-benefit">

                <div className="benefit-icon">
                  ✨
                </div>

                <div>

                  <h3>
                    Personalized AI Plans
                  </h3>

                  <p>
                    Plans built around your goals and lifestyle.
                  </p>

                </div>

              </div>


              {/* Benefit 2 */}

              <div className="signup-benefit">

                <div className="benefit-icon">
                  🎯
                </div>

                <div>

                  <h3>
                    Achieve Your Goals
                  </h3>

                  <p>
                    Stay consistent with smart recommendations.
                  </p>

                </div>

              </div>


              {/* Benefit 3 */}

              <div className="signup-benefit">

                <div className="benefit-icon">
                  📈
                </div>

                <div>

                  <h3>
                    Track Your Progress
                  </h3>

                  <p>
                    Monitor workouts, nutrition and results.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= PEOPLE ================= */}

          <div className="signup-people-area">

            <div className="signup-circle"></div>


            <div className="signup-person signup-man">

              <div className="signup-head"></div>

              <div className="signup-body"></div>

            </div>


            <div className="signup-person signup-woman">

              <div className="signup-head"></div>

              <div className="signup-body"></div>

            </div>


            {/* Community Card */}

            <div className="signup-community-card">

              <p>
                Join our community
              </p>

              <div className="signup-users">

                <span>👨🏻</span>
                <span>👩🏻</span>
                <span>👨🏽</span>
                <span>👩🏽</span>

                <strong>
                  +2K
                </strong>

              </div>

              <small>
                2,500+ Happy Members
              </small>

            </div>

          </div>

        </section>


        {/* ================= RIGHT SECTION ================= */}

        <section className="signup-right">

          <div className="signup-card">

            {/* Heading */}

            <div className="signup-card-heading">

              <h2>
                Create Your Account
              </h2>

              <p>
                Start your personalized fitness journey today
              </p>

            </div>


            {/* ================= FORM ================= */}

            <form
              className="signup-form"
              onSubmit={click}
            >

              {/* Full Name */}

              <div className="signup-input-group">

                <label>
                  Full Name
                </label>

                <div className="signup-input-wrapper">

                  <span className="signup-input-icon">
                    👤
                  </span>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    onChange={(e) =>
                      dispatch(setFullName(e.target.value))
                    }
                    value={data?.Fullname}
                  />

                </div>

              </div>


              {/* Email */}

              <div className="signup-input-group">

                <label>
                  Email Address
                </label>

                <div className="signup-input-wrapper">

                  <span className="signup-input-icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    onChange={(e) =>
                      dispatch(setsignupUser(e.target.value))
                    }
                    value={data?.user || ""}
                  />

                </div>

              </div>


              {/* Password */}

              <div className="signup-input-group">

                <label>
                  Password
                </label>

                <div className="signup-input-wrapper">

                  <span className="signup-input-icon">
                    🔒
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    onChange={(e) =>
                      dispatch(setsignupPassword(e.target.value))
                    }
                    value={data?.Password || ""}
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div className="signup-input-group">

                <label>
                  Confirm Password
                </label>

                <div className="signup-input-wrapper">

                  <span className="signup-input-icon">
                    🔒
                  </span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>


              {/* Terms */}

              <label className="terms-checkbox">

                <input
                  type="checkbox"
                />

                <span>
                  I agree to the{" "}

                  <a href="/">
                    Terms & Conditions
                  </a>{" "}

                  and{" "}

                  <a href="/">
                    Privacy Policy
                  </a>

                </span>

              </label>


              {/* Error */}

              {Error && (
                <div style={{ color: "red" }}>
                  {Error.message}
                </div>
              )}


              {/* Create Account */}

              <button
                type="submit"
                className="create-account-button"
                disabled={isPending}
              >
                {isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </button>


              {/* Divider */}

              {/* <div className="signup-divider">

                <span></span>

                <p>
                  or continue with
                </p>

                <span></span>

              </div> */}


              {/* Social Buttons */}

              {/* <div className="signup-social-buttons">

                <button
                  type="button"
                  className="signup-social-button"
                >

                  <span className="google-icon">
                    G
                  </span>

                  Continue with Google

                </button>


                <button
                  type="button"
                  className="signup-social-button"
                >

                  <span className="apple-icon">
                    ●
                  </span>

                  Continue with Apple

                </button>

              </div> */}


              {/* Login */}

              <p className="already-account">

                Already have an account?

                <Link to="/login">
                  Log In
                </Link>

              </p>

            </form>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="signup-footer">

        {/* Brand */}

        <div className="signup-footer-brand">

          <div className="brand">

            <div className="brand-icon">
              <span>+</span>
            </div>

            <span className="brand-name">
              FitPlan <span>AI</span>
            </span>

          </div>

          <p>
            © 2026 FitPlan AI. All rights reserved.
          </p>

        </div>


        {/* Product */}

        <div className="signup-footer-column">

          <h4>
            Product
          </h4>

          <a href="/">
            Features
          </a>

          <a href="/">
            How It Works
          </a>

          <a href="/">
            Plans & Pricing
          </a>

        </div>


        {/* Company */}

        <div className="signup-footer-column">

          <h4>
            Company
          </h4>

          <a href="/">
            About Us
          </a>

          <a href="/">
            Blog
          </a>

          <a href="/">
            Contact Us
          </a>

        </div>


        {/* Support */}

        <div className="signup-footer-column">

          <h4>
            Support
          </h4>

          <a href="/">
            Help Center
          </a>

          <a href="/">
            Privacy Policy
          </a>

          <a href="/">
            Terms of Service
          </a>

        </div>


        {/* Social */}

        <div className="signup-footer-social">

          <h4>
            Follow Us
          </h4>

          <div className="signup-social-icons">

            <a href="/">
              ◎
            </a>

            <a href="/">
              f
            </a>

            <a href="/">
              𝕏
            </a>

            <a href="/">
              ▶
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Signup;