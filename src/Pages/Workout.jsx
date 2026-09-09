import { useState } from "react";
import GenerateAI from "../auth/GenerateAI.js";
import { Userdata, getLoggedInUser } from "../tanstack/APIcall.js";
import "./Workout.css";
import Sidebar from "./Sidebar.jsx";
import { supabase } from "../supabase/supabase.js";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function Workout() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  // ========================================
  // GET LOGGED-IN USER
  // ========================================

  const {
    data: loggedInUser,
    isLoading: userLoading,
    error: userError,
  } = getLoggedInUser();

  // ========================================
  // GET USER PROFILE
  // ========================================

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = Userdata(loggedInUser?.id);

  // ========================================
  // GENERATE WORKOUT
  // ========================================

  const handleGenerate = async () => {
    if (!profile) {
      setAiError("User profile is not available.");
      return;
    }

    if (!loggedInUser?.id) {
      setAiError("User ID is not available.");
      return;
    }

    try {
      setGenerating(true);
      setAiError("");

      // ========================================
      // 1. CHECK SUPABASE FIRST
      // ========================================

      const { data: existingWorkout, error: fetchError } =
        await supabase
          .from("workout_plans")
          .select("workout_data")
          .eq("user_id", loggedInUser.id)
          .maybeSingle();

      if (fetchError) {
        console.error("Supabase Fetch Error:", fetchError);
        throw fetchError;
      }

      // ========================================
      // 2. WORKOUT ALREADY EXISTS
      // ========================================

      if (existingWorkout?.workout_data) {
        console.log("Workout found in Supabase.");

        setWorkoutPlan(existingWorkout.workout_data);
        setSelectedDay("Monday");

        return;
      }

      // ========================================
      // 3. NO WORKOUT → GENERATE AI
      // ========================================

      console.log("No workout found. Generating AI workout...");

      const result = await GenerateAI(profile);

      if (!result) {
        setAiError("AI did not return a workout plan.");
        return;
      }

      console.log("AI Raw Response:", result);

      // ========================================
      // 4. PARSE AI RESPONSE
      // ========================================

      let parsedResult;

      if (typeof result === "string") {
        try {
          parsedResult = JSON.parse(result);
        } catch (error) {
          console.error("JSON Parse Error:", error);

          const cleanedResult = result
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          try {
            parsedResult = JSON.parse(cleanedResult);
          } catch (secondError) {
            console.error(
              "Second JSON Parse Error:",
              secondError
            );

            setAiError(
              "AI returned invalid workout data. Please try again."
            );

            return;
          }
        }
      } else {
        parsedResult = result;
      }

      // ========================================
      // 5. CHECK DAYS
      // ========================================

      const missingDays = DAYS.filter(
        (day) => !parsedResult?.[day]
      );

      if (missingDays.length > 0) {
        console.error("Missing days:", missingDays);

        setAiError(
          `Workout data missing: ${missingDays.join(", ")}`
        );

        return;
      }

      // ========================================
      // 6. CHECK EXERCISES
      // ========================================

      const invalidDays = DAYS.filter((day) => {
        return (
          !Array.isArray(parsedResult?.[day]?.exercises) ||
          parsedResult[day].exercises.length !== 2
        );
      });

      if (invalidDays.length > 0) {
        setAiError(
          `Each day must have exactly 2 exercises. Check: ${invalidDays.join(
            ", "
          )}`
        );

        return;
      }

      // ========================================
      // 7. SAVE AI RESULT TO SUPABASE
      // ========================================

      const { error: saveError } = await supabase
        .from("workout_plans")
        .insert({
          user_id: loggedInUser.id,
          workout_data: parsedResult,
        });

      if (saveError) {
        console.error("Supabase Save Error:", saveError);
        throw saveError;
      }

      console.log("Workout saved successfully.");

      // ========================================
      // 8. SHOW WORKOUT
      // ========================================

      setWorkoutPlan(parsedResult);
      setSelectedDay("Monday");
    } catch (error) {
      console.error(
        "Workout Generation Error:",
        error
      );

      setAiError(
        error?.message ||
          "Something went wrong while generating workout."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (userLoading || profileLoading) {
    return (
      <div className="workout-loading">
        <div className="workout-spinner"></div>

        <h2>Loading your profile...</h2>

        <p>Please wait a moment.</p>
      </div>
    );
  }

  // ========================================
  // USER ERROR
  // ========================================

  if (userError) {
    return (
      <div className="workout-error">
        <h2>Unable to get logged-in user</h2>

        <p>{userError.message}</p>
      </div>
    );
  }

  // ========================================
  // PROFILE ERROR
  // ========================================

  if (profileError) {
    return (
      <div className="workout-error">
        <h2>Unable to load profile</h2>

        <p>{profileError.message}</p>
      </div>
    );
  }

  // ========================================
  // CURRENT WORKOUT
  // ========================================

  const currentWorkout = workoutPlan?.[selectedDay];

  const exercises = currentWorkout?.exercises || [];

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="workout-layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN PAGE */}
      <main className="workout-page">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="workout-header">

          <div className="workout-header-content">

            <div>

              <span className="workout-label">
                AI PERSONALIZED WORKOUT
              </span>

              <h1>
                Your Weekly Workout
              </h1>

              <p>
                A personalized 5-day workout plan
                based on your body, goals and lifestyle.
              </p>

            </div>

            <button
              className="generate-workout-btn"
              onClick={handleGenerate}
              disabled={generating}
            >

              {generating ? (
                <>
                  <span className="button-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  ✦ Generate Workout
                </>
              )}

            </button>

          </div>

        </header>

        {/* ========================================
            PROFILE SUMMARY
        ======================================== */}

        <section className="workout-profile">

          <div className="profile-box">
            <span>Weight</span>

            <strong>
              {profile?.weight ?? "--"} kg
            </strong>
          </div>

          <div className="profile-box">
            <span>Height</span>

            <strong>
              {profile?.height ?? "--"} cm
            </strong>
          </div>

          <div className="profile-box">
            <span>Goal</span>

            <strong>
              {profile?.goal ?? "--"}
            </strong>
          </div>

          <div className="profile-box">
            <span>Activity</span>

            <strong>
              {profile?.activityLevel ?? "--"}
            </strong>
          </div>

        </section>

        {/* ========================================
            ERROR
        ======================================== */}

        {aiError && (
          <div className="workout-ai-error">

            <strong>
              ⚠ {aiError}
            </strong>

            <button
              onClick={() => setAiError("")}
              type="button"
            >
              ×
            </button>

          </div>
        )}

        {/* ========================================
            EMPTY STATE
        ======================================== */}

        {!workoutPlan && !generating && (

          <section className="workout-empty">

            <div className="empty-icon">
              ✦
            </div>

            <h2>
              Ready to build your workout?
            </h2>

            <p>
              Let AI create a personalized
              Monday-to-Friday workout plan.
            </p>

            <button
              className="empty-generate-btn"
              onClick={handleGenerate}
              type="button"
            >
              Generate My Workout

              <span>
                →
              </span>
            </button>

          </section>

        )}

        {/* ========================================
            GENERATING
        ======================================== */}

        {generating && (

          <section className="workout-generating">

            <div className="large-spinner"></div>

            <h2>
              Creating your personalized plan...
            </h2>

            <p>
              AI is analyzing your goals,
              body information and experience.
            </p>

          </section>

        )}

        {/* ========================================
            WORKOUT PLAN
        ======================================== */}

        {workoutPlan && !generating && (

          <section className="workout-container">

            {/* ========================================
                DAY TABS
            ======================================== */}

            <div className="day-tabs">

              {DAYS.map((day) => {

                const dayWorkout =
                  workoutPlan?.[day];

                const exerciseCount =
                  dayWorkout?.exercises?.length || 0;

                return (

                  <button
                    key={day}
                    type="button"
                    className={`day-tab ${
                      selectedDay === day
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedDay(day)
                    }
                  >

                    {/* ONLY ONE DAY NAME */}
                    <strong>
                      {day}
                    </strong>

                    {/* EXERCISE COUNT */}
                    <small>
                      {exerciseCount}{" "}
                      {exerciseCount === 1
                        ? "Exercise"
                        : "Exercises"}
                    </small>

                  </button>

                );

              })}

            </div>

            {/* ========================================
                CURRENT DAY
            ======================================== */}

            {currentWorkout && (

              <>

                {/* DAY HEADER */}

                <div className="workout-day-header">

                  <div>

                    <span className="day-label">
                      {selectedDay}
                    </span>

                    <h2>
                      {currentWorkout.focus ||
                        "Workout"}
                    </h2>

                    <p>
                      Your personalized{" "}
                      {selectedDay} workout.
                    </p>

                  </div>

                  {/* DURATION */}

                  <div className="duration-card">

                    <span>
                      Duration
                    </span>

                    <strong>

                      {currentWorkout.duration_minutes ??
                        "--"}

                      <small>
                        {" "}min
                      </small>

                    </strong>

                  </div>

                </div>

                {/* ========================================
                    EXERCISES
                ======================================== */}

                <div className="exercises-section">

                  <div className="section-heading">

                    <div>

                      <span>
                        TODAY'S TRAINING
                      </span>

                      <h2>
                        Exercises
                      </h2>

                    </div>

                    <span className="exercise-count">

                      {exercises.length}{" "}

                      {exercises.length === 1
                        ? "Exercise"
                        : "Exercises"}

                    </span>

                  </div>

                  {/* EXERCISE LIST */}

                  <div className="exercise-list">

                    {exercises.map(
                      (exercise, index) => (

                        <div
                          className="exercise-card"
                          key={`${selectedDay}-${index}`}
                        >

                          {/* NUMBER */}

                          <div className="exercise-number">

                            {String(
                              index + 1
                            ).padStart(2, "0")}

                          </div>

                          {/* MAIN */}

                          <div className="exercise-main">

                            {/* NAME */}

                            <div className="exercise-title-row">

                              <h3>
                                {exercise?.name ||
                                  "Exercise"}
                              </h3>

                            </div>

                            {/* STATS */}

                            <div className="exercise-stats">

                              <div className="exercise-stat">

                                <span>
                                  Sets
                                </span>

                                <strong>
                                  {exercise?.sets ??
                                    "--"}
                                </strong>

                              </div>

                              <div className="exercise-stat">

                                <span>
                                  Reps
                                </span>

                                <strong>
                                  {exercise?.reps ??
                                    "--"}
                                </strong>

                              </div>

                              <div className="exercise-stat">

                                <span>
                                  Rest
                                </span>

                                <strong>
                                  {exercise?.rest_seconds ??
                                    "--"}s
                                </strong>

                              </div>

                            </div>

                            {/* INSTRUCTIONS */}

                            {exercise?.instructions && (

                              <div className="exercise-instructions">

                                <span>
                                  How to
                                </span>

                                <p>
                                  {exercise.instructions}
                                </p>

                              </div>

                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </>

            )}

            {/* ========================================
                WEEK SUMMARY
            ======================================== */}

            <div className="week-summary">

              <div>

                <span>
                  WEEKLY PLAN
                </span>

                <h2>
                  5 Days · 2 Recovery Days
                </h2>

                <p>
                  Monday to Friday training with
                  Saturday and Sunday reserved
                  for recovery.
                </p>

              </div>

              <div className="week-summary-icon">
                ✦
              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}