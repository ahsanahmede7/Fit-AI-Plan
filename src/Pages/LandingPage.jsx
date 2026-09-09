import { Link } from "react-router-dom";
import "./Landing.css";

function LandingPage() {
  return (
    <div className="LandingPage">

      {/* ================= NAVBAR ================= */}
      <header className="navbar">

        <div className="logo">
          <div className="logo-icon">+</div>
          <Link to={'/n'}><span>
            FitPlan <b>AI</b>
          </span></Link>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>

          <Link to="/workout">
            Plans
          </Link>
        </nav>

        <div className="nav-buttons">

          <Link to="/login" className="login-btn">
            Log In
          </Link>

          <Link to="/register" className="primary-btn">
            Get Started
          </Link>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">
              AI-Powered Fitness & Nutrition
            </div>

            <h1>
              Your AI-Powered
              <span>Fitness & Nutrition</span>
              Coach
            </h1>

            <p className="hero-description">
              Personalized meal plans, smart workout routines and real
              progress tracking — all powered by AI.
            </p>

            <div className="hero-buttons">

              <Link
                to="/register"
                className="primary-btn hero-btn"
              >
                Get Started Free
              </Link>

              <a
                href="#how-it-works"
                className="outline-btn"
              >
                <span className="play-icon">▶</span>
                See How It Works
              </a>

            </div>


            {/* REVIEWS */}
            <div className="reviews">

              <div className="avatars">
                <div>👨🏻</div>
                <div>👩🏻</div>
                <div>👨🏽</div>
                <div>👩🏽</div>
              </div>

              <div className="stars">
                ★★★★★
              </div>

              <strong>4.8</strong>

              <span>
                (2,500+ reviews)
              </span>

            </div>

          </div>


          {/* ================= HERO VISUAL ================= */}
          <div className="hero-visual">

            <div className="hero-circle"></div>

            <div className="fitness-people">

              <div className="person male">
                🏋️‍♂️
              </div>

              <div className="person female">
                🏋️‍♀️
              </div>

            </div>


            {/* Calories Card */}
            <div className="floating-card calories-card">

              <div className="card-title">
                <span className="orange-icon">
                  🔥
                </span>

                Calories
              </div>

              <strong>
                2,450
              </strong>

              <span>
                / 2,800 kcal
              </span>

              <div className="progress">
                <div className="progress-fill"></div>
              </div>

            </div>


            {/* Weight Card */}
            <div className="floating-card weight-card">

              <div className="card-title">
                <span>◉</span>
                Weight
              </div>

              <strong>
                72.5 kg
              </strong>

              <p>
                <span className="green">
                  ↓ 1.2 kg
                </span>

                {" "}this week
              </p>

            </div>


            {/* Workout Card */}
            <div className="floating-card workout-card">

              <div className="card-title">
                <span className="purple-icon">
                  ✚
                </span>

                Workouts
              </div>

              <strong>
                3 / 4
              </strong>

              <p>
                Completed this week
              </p>

              <div className="progress">
                <div className="workout-progress"></div>
              </div>

            </div>

          </div>

        </section>


        {/* ================= TRUST BAR ================= */}
        <section className="trust-bar">

          <div className="trust-item">

            <div className="trust-icon">
              ♢
            </div>

            <div>
              <strong>
                AI Personalization
              </strong>

              <p>
                Plans made just for you
              </p>
            </div>

          </div>


          <div className="trust-divider"></div>


          <div className="trust-item">

            <div className="trust-icon">
              ♧
            </div>

            <div>
              <strong>
                Real Food & Prices
              </strong>

              <p>
                Meal plans within your budget
              </p>
            </div>

          </div>


          <div className="trust-divider"></div>


          <div className="trust-item">

            <div className="trust-icon">
              ⌁
            </div>

            <div>
              <strong>
                Smart Progress Tracking
              </strong>

              <p>
                Track workouts, weight & more
              </p>
            </div>

          </div>


          <div className="trust-divider"></div>


          <div className="trust-item">

            <div className="trust-icon">
              ♙
            </div>

            <div>
              <strong>
                Secure & Private
              </strong>

              <p>
                Your data is 100% safe
              </p>
            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section
          className="features-section"
          id="features"
        >

          <div className="section-label">
            FEATURES
          </div>

          <h2>
            Everything you need to reach your goals
          </h2>

          <p className="section-description">
            Advanced AI technology meets fitness science to deliver
            personalized plans that actually work.
          </p>


          <div className="feature-grid">

            <FeatureCard
              icon="🍽"
              title="AI Meal Plans"
              description="Personalized meal plans with real ingredients and budget-friendly options."
            />

            <FeatureCard
              icon="🏋"
              title="Workout Plans"
              description="Custom workout splits based on your goals, equipment and availability."
            />

            <FeatureCard
              icon="📊"
              title="Progress Tracking"
              description="Track your weight, measurements and see your progress with beautiful charts."
            />

            <FeatureCard
              icon="🛒"
              title="Grocery Lists"
              description="Auto-generated grocery lists with estimated costs to fit your budget."
            />

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}
        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="section-label">
            HOW IT WORKS
          </div>

          <h2>
            Simple steps to a healthier, stronger you
          </h2>


          <div className="steps">

            <Step
              number="1"
              icon="👤"
              title="Tell us about you"
              description="Share your goals, preferences, and fitness level."
            />

            <div className="arrow">
              →
            </div>

            <Step
              number="2"
              icon="▦"
              title="AI creates your plan"
              description="Our AI analyzes everything to build your perfect plan."
            />

            <div className="arrow">
              →
            </div>

            <Step
              number="3"
              icon="📋"
              title="Follow & track"
              description="Follow your plan and track your progress daily."
            />

            <div className="arrow">
              →
            </div>

            <Step
              number="4"
              icon="↗"
              title="Improve & achieve"
              description="Get better results with AI adjustments every week."
            />

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-logo">
          FitPlan <b>AI</b>
        </div>

        <p>
          Your AI-powered fitness & nutrition coach.
        </p>

        <div className="footer-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <Link to="/workout">
            Plans
          </Link>

          <a href="#about">
            About
          </a>

        </div>

        <p className="copyright">
          © 2026 FitPlan AI. All rights reserved.
        </p>

      </footer>

    </div>
  );
}


/* ================= FEATURE CARD ================= */

function FeatureCard({
  icon,
  title,
  description
}) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <a href="#features">
        Learn More →
      </a>

    </div>
  );
}


/* ================= STEP ================= */

function Step({
  number,
  icon,
  title,
  description
}) {
  return (
    <div className="step">

      <div className="step-icon">
        {icon}
      </div>

      <div className="step-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}


export default LandingPage;
