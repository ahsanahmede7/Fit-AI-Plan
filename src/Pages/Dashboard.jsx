import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

import {
  getLoggedInUser,
  Userdata,
} from "../tanstack/APIcall";

import { calculateCalories } from "./calories.js";
import Sidebar from "./Sidebar.jsx";

function Dashboard() {

  // ========================================
  // GET CURRENT LOGGED-IN USER
  // ========================================

  const {
    data: loggedInUser,
    isLoading: userLoading,
    error: userError,
  } = getLoggedInUser();


  // ========================================
  // GET CURRENT USER PROFILE
  // ========================================

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = Userdata(loggedInUser?.id);


  // ========================================
  // TODAY'S MEALS STATE
  // ========================================

  const [meals, setMeals] = useState([
    {
      id: 1,
      type: "Breakfast",
      name: "Egg & Avocado Toast",
      calories: 420,
      protein: 24,
      icon: "🍳",
      completed: false,
    },

    {
      id: 2,
      type: "Lunch",
      name: "Grilled Chicken Salad",
      calories: 520,
      protein: 42,
      icon: "🥗",
      completed: false,
    },

    {
      id: 3,
      type: "Dinner",
      name: "Chicken Rice Bowl",
      calories: 480,
      protein: 38,
      icon: "🍚",
      completed: false,
    },
  ]);


  // ========================================
  // TOGGLE MEAL
  // ========================================

  const toggleMeal = (mealId) => {

    setMeals((previousMeals) =>
      previousMeals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              completed: !meal.completed,
            }
          : meal
      )
    );

  };


  // ========================================
  // MEAL PROGRESS
  // ========================================

  const completedMeals = meals.filter(
    (meal) => meal.completed
  ).length;

  const totalMeals = meals.length;

  const mealPercentage =
    totalMeals > 0
      ? Math.round((completedMeals / totalMeals) * 100)
      : 0;


  // ========================================
  // CALORIES
  // ========================================

  const caloriesConsumed = meals
    .filter((meal) => meal.completed)
    .reduce(
      (total, meal) => total + meal.calories,
      0
    );


  const calorieGoal = profile
    ? calculateCalories(profile)
    : 0;


  const remainingCalories =
    Math.max(calorieGoal - caloriesConsumed, 0);


  const caloriePercentage =
    calorieGoal > 0
      ? Math.min(
          Math.round(
            (caloriesConsumed / calorieGoal) * 100
          ),
          100
        )
      : 0;


  // ========================================
  // WATER
  // ========================================

  const waterConsumed = 5;
  const waterGoal = 8;

  const waterPercentage =
    Math.round(
      (waterConsumed / waterGoal) * 100
    );


  // ========================================
  // TARGET WEIGHT PROGRESS
  // ========================================

  const currentWeight = Number(profile?.weight);
  const targetWeight = Number(profile?.targetWeight);

  let targetProgress = 0;

  if (
    Number.isFinite(currentWeight) &&
    Number.isFinite(targetWeight) &&
    currentWeight > 0 &&
    targetWeight > 0
  ) {

    if (currentWeight === targetWeight) {
      targetProgress = 100;
    } else {
      targetProgress = 25;
    }

  }


  // ========================================
  // LOADING
  // ========================================

  if (userLoading || profileLoading) {

    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );

  }


  // ========================================
  // USER ERROR
  // ========================================

  if (userError) {

    return (
      <div className="dashboard-error">

        <h2>
          Unable to get logged-in user
        </h2>

        <p>
          {userError.message}
        </p>

      </div>
    );

  }


  // ========================================
  // PROFILE ERROR
  // ========================================

  if (profileError) {

    return (
      <div className="dashboard-error">

        <h2>
          Unable to load profile
        </h2>

        <p>
          {profileError.message}
        </p>

      </div>
    );

  }


  // ========================================
  // GREETING
  // ========================================

  const hour = new Date().getHours();

  let greeting;

  if (hour >= 6 && hour < 12) {

    greeting = "Good Morning";

  } else if (hour >= 12 && hour < 18) {

    greeting = "Good Afternoon";

  } else if (hour >= 18 && hour < 21) {

    greeting = "Good Evening";

  } else {

    greeting = "Good Night";

  }


  // ========================================
  // AVATAR LETTER
  // ========================================

  const avatarName =
    profile?.fullName ||
    profile?.full_name ||
    loggedInUser?.email ||
    "User";

  const avatarLetter =
    avatarName.charAt(0).toUpperCase();


  // ========================================
  // DASHBOARD
  // ========================================

  return (

    <div className="dashboard-page">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar />


      {/* ========================================
          MAIN
      ======================================== */}

      <main className="dashboard-main">


        {/* ========================================
            TOP BAR
        ======================================== */}

        <header className="dashboard-topbar">

          <div>

            <p className="dashboard-date">

              {new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}

            </p>


            <h1>

              {greeting},{" "}
              {profile?.fullName ||
                profile?.full_name ||
                "User"}

              <span>👋</span>

            </h1>


            <p className="dashboard-subtitle">

              Here's your personalized plan
              for today.

            </p>

          </div>


          <div className="dashboard-user-area">

            <button
              type="button"
              className="notification-btn"
              aria-label="Notifications"
            >
              ♢
              <span></span>
            </button>


            <div className="dashboard-avatar">

              {avatarLetter}

            </div>

          </div>

        </header>


        {/* ========================================
            AI PLAN CARD
        ======================================== */}

        <section className="ai-plan-card">

          <div className="ai-plan-content">

            <div className="ai-plan-badge">

              ✦ AI PERSONALIZED PLAN

            </div>


            <h2>

              Your fitness journey,
              <br />
              powered by AI.

            </h2>


            <p>

              Get a personalized meal and workout
              plan based on your body, goals and
              lifestyle.

            </p>


            <Link
              to="/workout"
              className="ai-plan-button"
            >

              Generate My Plan

              <span>→</span>

            </Link>

          </div>


          <div className="ai-plan-decoration">

            <div className="ai-circle-big"></div>

            <div className="ai-circle-small">
              ✦
            </div>

          </div>

        </section>


        {/* ========================================
            STATS
        ======================================== */}

        <section className="dashboard-stats">


          {/* CURRENT WEIGHT */}

          <div className="dashboard-stat-card">

            <div className="stat-card-header">

              <span>
                Current Weight
              </span>

              <div className="stat-purple-icon">
                ⚖
              </div>

            </div>


            <h3>

              {profile?.weight ?? "--"}

              <small>
                {" "}kg
              </small>

            </h3>


            <p className="stat-positive">

              Your current weight

            </p>

          </div>


          {/* TARGET WEIGHT */}

          <div className="dashboard-stat-card">

            <div className="stat-card-header">

              <span>
                Target Weight
              </span>

              <div className="stat-purple-icon">
                ◉
              </div>

            </div>


            <h3>

              {profile?.targetWeight ?? "--"}

              <small>
                {" "}kg
              </small>

            </h3>


            <div className="stat-progress">

              <div
                className="stat-progress-fill"
                style={{
                  width: `${targetProgress}%`,
                }}
              ></div>

            </div>


            <p className="stat-muted">

              Your target weight

            </p>

          </div>


          {/* CALORIES */}

          <div className="dashboard-stat-card">

            <div className="stat-card-header">

              <span>
                Calories
              </span>

              <div className="stat-purple-icon">
                ♨
              </div>

            </div>


            <h3>

              {caloriesConsumed.toLocaleString()}

              <small>
                {" "} /{" "}
                {calorieGoal.toLocaleString()} kcal
              </small>

            </h3>


            <div className="stat-progress">

              <div
                className="stat-progress-fill"
                style={{
                  width: `${caloriePercentage}%`,
                }}
              ></div>

            </div>


            <p className="stat-muted">

              {remainingCalories.toLocaleString()}
              {" "}kcal remaining

            </p>

          </div>


          {/* WATER */}

          <div className="dashboard-stat-card">

            <div className="stat-card-header">

              <span>
                Water Intake
              </span>

              <div className="stat-purple-icon">
                ◇
              </div>

            </div>


            <h3>

              {waterConsumed}

              <small>
                {" "} / {waterGoal} glasses
              </small>

            </h3>


            <div className="stat-progress">

              <div
                className="stat-progress-fill"
                style={{
                  width: `${waterPercentage}%`,
                }}
              ></div>

            </div>


            <p className="stat-muted">

              {waterGoal - waterConsumed}
              {" "}glasses remaining

            </p>

          </div>

        </section>


        {/* ========================================
            USER INFORMATION
        ======================================== */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <span className="dashboard-card-label">
                YOUR PROFILE
              </span>

              <h2>
                Body Information
              </h2>

            </div>


            <Link to="/profile">
              Edit Profile →
            </Link>

          </div>


          <div className="profile-info-grid">

            <div>

              <span>
                Age :
              </span>

              <strong>
                {profile?.age ?? "--"}
              </strong>

            </div>


            <div>

              <span>
                Height :
              </span>

              <strong>
                {profile?.height ?? "--"} cm
              </strong>

            </div>


            <div>

              <span>
                Weight :
              </span>

              <strong>
                {profile?.weight ?? "--"} kg
              </strong>

            </div>


            <div>

              <span>
                Target Weight :
              </span>

              <strong>
                {profile?.targetWeight ?? "--"} kg
              </strong>

            </div>


            <div>

              <span>
                Gender :
              </span>

              <strong>
                {profile?.gender ?? "--"}
              </strong>

            </div>


            <div>

              <span>
                Goal :
              </span>

              <strong>
                {profile?.goal ?? "--"}
              </strong>

            </div>


            <div>

              <span>
                Activity Level :
              </span>

              <strong>
                {profile?.activityLevel ??
                  profile?.activity_level ??
                  "--"}
              </strong>

            </div>


            <div>

              <span>
                Diet :
              </span>

              <strong>
                {profile?.diet ?? "--"}
              </strong>

            </div>

          </div>

        </section>


        {/* ========================================
            TODAY CONTENT
        ======================================== */}

        <section className="dashboard-content-grid">


          {/* ========================================
              TODAY'S MEALS
          ======================================== */}

          <div className="dashboard-card">

            <div className="dashboard-card-header">

              <div>

                <span className="dashboard-card-label">
                  TODAY'S PLAN
                </span>

                <h2>
                  Today's Meals
                </h2>

              </div>


              <Link to="/meal-plan">
                View All →
              </Link>

            </div>


            {/* MEAL PROGRESS */}

            <div className="meal-progress">

              <div className="meal-progress-text">

                <span>

                  {completedMeals} of{" "}
                  {totalMeals} meals completed

                </span>


                <span>
                  {mealPercentage}%
                </span>

              </div>


              <div className="meal-progress-bar">

                <div
                  className="meal-progress-fill"
                  style={{
                    width: `${mealPercentage}%`,
                  }}
                ></div>

              </div>

            </div>


            {/* MEALS */}

            <div className="today-meals">

              {meals.map((meal) => (

                <div
                  className={`meal-row ${
                    meal.completed
                      ? "meal-row-completed"
                      : ""
                  }`}
                  key={meal.id}
                >


                  {/* MEAL ICON */}

                  <div className="meal-image">

                    {meal.icon}

                  </div>


                  {/* MEAL DETAILS */}

                  <div className="meal-details">

                    <span>
                      {meal.type}
                    </span>

                    <h3>
                      {meal.name}
                    </h3>

                    <p>

                      {meal.calories} kcal ·{" "}
                      {meal.protein}g protein

                    </p>

                  </div>


                  {/* COMPLETE BUTTON */}

                  <button
                    type="button"
                    className={`meal-check ${
                      meal.completed
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      toggleMeal(meal.id)
                    }
                    aria-label={
                      meal.completed
                        ? `Mark ${meal.type} as incomplete`
                        : `Mark ${meal.type} as completed`
                    }
                  >

                    {meal.completed
                      ? "✓"
                      : "+"}

                  </button>

                </div>

              ))}

            </div>

          </div>


          {/* ========================================
              TODAY'S WORKOUT
          ======================================== */}

          <div className="dashboard-card">

            <div className="dashboard-card-header">

              <div>

                <span className="dashboard-card-label">
                  TODAY'S WORKOUT
                </span>

                <h2>
                  Upper Body
                </h2>

              </div>


              <span className="workout-time">
                35 min
              </span>

            </div>


            <div className="workout-highlight">

              <div className="workout-main-icon">
                ♧
              </div>


              <div>

                <h3>
                  Upper Body Strength
                </h3>

                <p>
                  6 exercises · 3 sets each
                </p>

              </div>

            </div>


            <div className="exercise-row">

              <span>
                01
              </span>

              <p>
                Push Ups
              </p>

              <strong>
                3 × 12
              </strong>

            </div>


            <div className="exercise-row">

              <span>
                02
              </span>

              <p>
                Shoulder Press
              </p>

              <strong>
                3 × 10
              </strong>

            </div>


            <div className="exercise-row">

              <span>
                03
              </span>

              <p>
                Bicep Curls
              </p>

              <strong>
                3 × 12
              </strong>

            </div>


            <Link
              to="/workout"
              className="start-workout-button"
            >
              Start Workout →
            </Link>

          </div>

        </section>


        {/* ========================================
            BOTTOM CONTENT
        ======================================== */}

        <section className="dashboard-bottom-grid">


          {/* ========================================
              MACROS
          ======================================== */}

          <div className="dashboard-card">

            <div className="dashboard-card-header">

              <div>

                <span className="dashboard-card-label">
                  NUTRITION
                </span>

                <h2>
                  Today's Macros
                </h2>

              </div>

            </div>


            <div className="macro-layout">

              <div className="macro-circle">

                <strong>
                  71%
                </strong>

                <span>
                  Daily Goal
                </span>

              </div>


              <div className="macro-values">

                <div className="macro-value">

                  <span>
                    Protein
                  </span>

                  <strong>
                    86g / 120g
                  </strong>

                </div>


                <div className="macro-value">

                  <span>
                    Carbs
                  </span>

                  <strong>
                    142g / 220g
                  </strong>

                </div>


                <div className="macro-value">

                  <span>
                    Fat
                  </span>

                  <strong>
                    48g / 65g
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* ========================================
              WEEKLY PROGRESS
          ======================================== */}

          <div className="dashboard-card">

            <div className="dashboard-card-header">

              <div>

                <span className="dashboard-card-label">
                  YOUR JOURNEY
                </span>

                <h2>
                  Weekly Progress
                </h2>

              </div>


              <Link to="/progress">
                Details →
              </Link>

            </div>


            <div className="progress-chart">

              <div className="chart-bars">

                <div style={{ height: "42%" }}></div>

                <div style={{ height: "58%" }}></div>

                <div style={{ height: "50%" }}></div>

                <div style={{ height: "72%" }}></div>

                <div style={{ height: "88%" }}></div>

                <div style={{ height: "64%" }}></div>

                <div style={{ height: "94%" }}></div>

              </div>


              <div className="chart-days">

                <span>
                  Mon
                </span>

                <span>
                  Tue
                </span>

                <span>
                  Wed
                </span>

                <span>
                  Thu
                </span>

                <span>
                  Fri
                </span>

                <span>
                  Sat
                </span>

                <span>
                  Sun
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
