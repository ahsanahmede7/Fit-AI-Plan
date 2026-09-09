import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setUser, setPassword,setUserId } from "../redux/LoginSlice";
import { useLogin } from "../tanstack/APIcall";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data1 = useSelector((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [EError, Seterror] = useState("");

  // React Query mutation
  const { mutate, isPending } = useLogin();

  const Submit = (e) => {
    e.preventDefault();

    Seterror("");

    mutate(
      {
        email: data1.user,
        password: data1.Password,
      },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);
          dispatch(setUserId(data.user.id))
          dispatch(setUser(""));
          dispatch(setPassword(""));

          navigate("/userprofile");
        },

        onError: (error) => {
          console.log("Login error:", error);

          Seterror(error);
        },
      }
    );
  };

  return (
    <div className="login-page">

      {/* ================= NAVBAR ================= */}
      <header className="login-navbar">

        <div className="brand">
          <div className="brand-icon">
            <span>+</span>
          </div>

          <Link to={'/'}><span className="brand-name">
            FitPlan <span>AI</span>
          </span></Link>
        </div>

        <nav className="navbar-links">
          <a href="/">Features</a>
          <a href="/">How It Works</a>
          <a href="/">Plans</a>
        </nav>

        <div className="navbar-actions">

          <Link to="/login">
            <button className="navbar-login">
              Log In
            </button>
          </Link>

          <button className="navbar-start">
            Get Started
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="login-main">

        {/* ================= LEFT SIDE ================= */}
        <section className="login-left">

          <div className="left-content">

            {/* Badge */}
            <div className="ai-badge">
              ✨ AI-Powered Fitness & Nutrition
            </div>


            {/* Heading */}
            <h1 className="login-heading">
              Your Goals.
              <br />

              Our AI.
              <br />

              <span>Amazing Results.</span>
            </h1>


            {/* Description */}
            <p className="login-description">
              Join thousands of people who are transforming
              their body and lifestyle with personalized
              plans powered by AI.
            </p>


            {/* Features */}
            <div className="login-features">

              <Feature
                icon="◉"
                title="Personalized Plans"
                text="Made just for your body, goals and preferences."
              />

              <Feature
                icon="↗"
                title="Smart Tracking"
                text="Track your workouts, nutrition and progress."
              />

              <Feature
                icon="◇"
                title="Real Results"
                text="Real transformations from real people."
              />

            </div>

          </div>


          {/* ================= PEOPLE AREA ================= */}
          <div className="people-area">

            <div className="people-circle"></div>

            <div className="person-placeholder man">
              <div className="person-head"></div>
              <div className="person-body"></div>
            </div>

            <div className="person-placeholder woman">
              <div className="person-head"></div>
              <div className="person-body"></div>
            </div>


            {/* Community Card */}
            <div className="community-card">

              <p className="community-title">
                Join our community
              </p>

              <div className="community-users">

                <div className="mini-user">👨🏻</div>
                <div className="mini-user">👩🏻</div>
                <div className="mini-user">👨🏽</div>
                <div className="mini-user">👩🏽</div>

                <div className="more-users">
                  +2K
                </div>

              </div>

              <p className="community-count">
                2,500+ Happy Members
              </p>

            </div>

          </div>

        </section>


        {/* ================= RIGHT SIDE ================= */}
        <section className="login-right">

          <div className="login-card">

            {/* Heading */}
            <div className="login-card-heading">

              <h2>
                Welcome Back <span>👋</span>
              </h2>

              <p>
                Log in to continue your fitness journey
              </p>

            </div>


            {/* ================= FORM ================= */}
            <form onSubmit={Submit} className="login-form">

              {/* Email */}
              <div className="input-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    onChange={(e) =>
                      dispatch(setUser(e.target.value))
                    }
                    value={data1.user}
                  />

                </div>

              </div>


              {/* Password */}
              <div className="input-group">

                <label>
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={(e) =>
                      dispatch(setPassword(e.target.value))
                    }
                    value={data1.Password}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>


              {/* Error */}
              {EError && (
                <div className="error-message">
                  {EError.message}
                </div>
              )}


              {/* Remember + Forgot */}
              <div className="login-options">

                <label className="remember">

                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>
                    Remember me
                  </span>

                </label>

                <a href="/forgot-password">
                  Forgot password?
                </a>

              </div>


              {/* Login Button */}
              <button
                type="submit"
                className="main-login-button"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log In"}
              </button>


              {/* Divider */}
              <div className="or-divider">

                <span></span>

                <p>or continue with</p>

                <span></span>

              </div>


              {/* Register */}
              <p className="signup-text">

                Don't have an account?

                <Link to="/register">
                  Sign up
                </Link>

              </p>

            </form>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="login-footer">

        <div className="footer-brand">

          <div className="brand footer-logo">

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


        <FooterColumn
          title="Product"
          links={[
            "Features",
            "How It Works",
            "Plans & Pricing"
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            "About Us",
            "Blog",
            "Contact Us"
          ]}
        />

        <FooterColumn
          title="Support"
          links={[
            "Help Center",
            "Privacy Policy",
            "Terms of Service"
          ]}
        />


        {/* Social */}
        <div className="footer-social">

          <h4>Follow Us</h4>

          <div className="social-icons">

            <a href="#">◎</a>
            <a href="#">f</a>
            <a href="#">𝕏</a>
            <a href="#">▶</a>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================= FEATURE COMPONENT ================= */

function Feature({ icon, title, text }) {
  return (
    <div className="login-feature">

      <div className="feature-round-icon">
        {icon}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


/* ================= FOOTER COMPONENT ================= */

function FooterColumn({ title, links }) {
  return (
    <div className="footer-column">

      <h4>
        {title}
      </h4>

      {links.map((link) => (
        <a href="#" key={link}>
          {link}
        </a>
      ))}

    </div>
  );
}


export default Login;