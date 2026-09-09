import React, { useEffect, useState } from "react";
import "./MealPlan.css";
import Sidebar from "./Sidebar";

import GenerateDietAI from "../auth/GenerateDietAI.js";
import { Userdata, getLoggedInUser } from "../tanstack/APIcall.js";
import { supabase } from "../supabase/supabase.js";

// ======================================================
// DAYS
// ======================================================

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ======================================================
// MEAL TYPES
// ======================================================

const MEAL_TYPES = [
  "Breakfast",
  "Lunch",
  "Snack",
  "Dinner",
];

// ======================================================
// ICONS
// ======================================================

const MEAL_ICONS = {
  Breakfast: "🥣",
  Lunch: "🍗",
  Snack: "🥜",
  Dinner: "🥗",
};

// ======================================================
// COMPONENT
// ======================================================

function MealPlan() {
  // ====================================================
  // STATE
  // ====================================================

  const [dietPlan, setDietPlan] = useState(null);

  const [selectedDay, setSelectedDay] = useState("Monday");

  const [completedMeals, setCompletedMeals] = useState([]);

  const [generating, setGenerating] = useState(false);

  const [loadingDiet, setLoadingDiet] = useState(true);

  const [aiError, setAiError] = useState("");

  // ====================================================
  // GET LOGGED-IN USER
  // ====================================================

  const {
    data: loggedInUser,
    isLoading: userLoading,
    error: userError,
  } = getLoggedInUser();

  // ====================================================
  // GET USER PROFILE
  // ====================================================

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = Userdata(loggedInUser?.id);

  // ====================================================
  // FETCH SAVED DIET
  // ====================================================

  useEffect(() => {
    if (!loggedInUser?.id) {
      return;
    }

    fetchSavedDiet();
  }, [loggedInUser?.id]);

  // ====================================================
  // FETCH DIET FROM SUPABASE
  // ====================================================

  const fetchSavedDiet = async () => {
    try {
      setLoadingDiet(true);
      setAiError("");

      const { data, error } = await supabase
        .from("diet_plans")
        .select("diet_data")
        .eq("user_id", loggedInUser.id)
        .maybeSingle();

      if (error) {
        console.error("Supabase Diet Fetch Error:", error);

        setAiError("Unable to load your saved diet plan.");
        return;
      }

      // ================================================
      // DIET FOUND
      // ================================================

      if (data?.diet_data) {
        console.log("Saved diet found:", data.diet_data);

        setDietPlan(data.diet_data);

        setSelectedDay("Monday");
      }
    } catch (error) {
      console.error("Fetch Diet Error:", error);

      setAiError(
        "Something went wrong while loading your diet."
      );
    } finally {
      setLoadingDiet(false);
    }
  };

  // ====================================================
  // GENERATE DIET
  // ====================================================

  const handleGenerateDiet = async () => {
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

      // ================================================
      // CHECK SUPABASE FIRST
      // ================================================

      const {
        data: existingDiet,
        error: fetchError,
      } = await supabase
        .from("diet_plans")
        .select("diet_data")
        .eq("user_id", loggedInUser.id)
        .maybeSingle();

      if (fetchError) {
        console.error(
          "Supabase Check Error:",
          fetchError
        );

        throw fetchError;
      }

      // ================================================
      // ALREADY EXISTS
      // ================================================

      if (existingDiet?.diet_data) {
        console.log(
          "Diet already exists. Loading saved diet."
        );

        setDietPlan(existingDiet.diet_data);

        setSelectedDay("Monday");

        return;
      }

      // ================================================
      // GENERATE NEW DIET
      // ================================================

      console.log("No saved diet found.");

      console.log("Generating new AI diet...");

      const result = await GenerateDietAI(profile);

      if (!result) {
        setAiError(
          "AI did not return a diet plan."
        );

        return;
      }

      console.log(
        "AI Raw Diet Response:",
        result
      );

      // ================================================
      // PARSE JSON
      // ================================================

      let parsedResult;

      if (typeof result === "string") {
        try {
          parsedResult = JSON.parse(result);
        } catch (error) {
          console.error(
            "First JSON Parse Error:",
            error
          );

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
              "AI returned invalid diet data. Please generate again."
            );

            return;
          }
        }
      } else {
        parsedResult = result;
      }

      // ================================================
      // VALIDATE DAYS
      // ================================================

      const missingDays = DAYS.filter(
        (day) => !parsedResult?.[day]
      );

      if (missingDays.length > 0) {
        console.error(
          "Missing Days:",
          missingDays
        );

        setAiError(
          `Diet data missing: ${missingDays.join(", ")}`
        );

        return;
      }

      // ================================================
      // VALIDATE MEALS
      // ================================================

      const invalidDays = DAYS.filter((day) => {
        const meals = parsedResult?.[day]?.meals;

        if (!meals) {
          return true;
        }

        return MEAL_TYPES.some(
          (mealType) => !meals?.[mealType]
        );
      });

      if (invalidDays.length > 0) {
        console.error(
          "Invalid diet days:",
          invalidDays
        );

        setAiError(
          `Meals missing for: ${invalidDays.join(", ")}`
        );

        return;
      }

      // ================================================
      // SAVE TO SUPABASE
      // ================================================

      const { error: saveError } = await supabase
        .from("diet_plans")
        .insert({
          user_id: loggedInUser.id,
          diet_data: parsedResult,
        });

      if (saveError) {
        console.error(
          "Supabase Save Error:",
          saveError
        );

        throw saveError;
      }

      console.log(
        "Diet saved successfully."
      );

      // ================================================
      // SHOW DIET
      // ================================================

      setDietPlan(parsedResult);

      setSelectedDay("Monday");
    } catch (error) {
      console.error(
        "Diet Generation Error:",
        error
      );

      setAiError(
        error?.message ||
          "Something went wrong while generating your diet."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ====================================================
  // LOADING USER / PROFILE
  // ====================================================

  if (
    userLoading ||
    profileLoading ||
    loadingDiet
  ) {
    return (
      <div className="meal-plan-loading">
        <div className="workout-spinner"></div>

        <h2>
          Loading your meal plan...
        </h2>

        <p>
          Please wait a moment.
        </p>
      </div>
    );
  }

  // ====================================================
  // USER ERROR
  // ====================================================

  if (userError) {
    return (
      <div className="meal-plan-error">
        <h2>
          Unable to get logged-in user
        </h2>

        <p>
          {userError.message}
        </p>
      </div>
    );
  }

  // ====================================================
  // PROFILE ERROR
  // ====================================================

  if (profileError) {
    return (
      <div className="meal-plan-error">
        <h2>
          Unable to load profile
        </h2>

        <p>
          {profileError.message}
        </p>
      </div>
    );
  }

  // ====================================================
  // CURRENT DAY
  // ====================================================

  const currentDay = dietPlan?.[selectedDay];

  const meals = currentDay?.meals || {};

  // ====================================================
  // CALCULATE TOTALS
  // ====================================================

  const totalCalories = Number(
    currentDay?.total_calories || 0
  );

  const totalProtein = Number(
    currentDay?.total_protein_g || 0
  );

  const totalCarbs = Number(
    currentDay?.total_carbs_g || 0
  );

  const totalFat = Number(
    currentDay?.total_fat_g || 0
  );

  // ====================================================
  // MEAL COMPLETION
  // ====================================================

  const getMealKey = (day, mealType) => {
    return `${day}-${mealType}`;
  };

  const toggleMealComplete = (mealType) => {
    const key = getMealKey(
      selectedDay,
      mealType
    );

    setCompletedMeals((previous) => {
      if (previous.includes(key)) {
        return previous.filter(
          (item) => item !== key
        );
      }

      return [
        ...previous,
        key,
      ];
    });
  };

  // ====================================================
  // COMPLETED MEALS
  // ====================================================

  const completedCount = MEAL_TYPES.filter(
    (mealType) =>
      completedMeals.includes(
        getMealKey(
          selectedDay,
          mealType
        )
      )
  ).length;

  const progress = Math.round(
    (completedCount / MEAL_TYPES.length) * 100
  );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div>
      <Sidebar />

      <div className="meal-plan-page">

        {/* ==============================================
            HEADER
        ============================================== */}

        <div className="meal-plan-header">
          <div>
            <p className="meal-plan-label">
              YOUR NUTRITION
            </p>

            <h1>
              Today's Meal Plan
            </h1>

            <p className="meal-plan-subtitle">
              Stay on track with your personalized
              nutrition plan.
            </p>
          </div>

          <button
            className="generate-plan-btn"
            onClick={handleGenerateDiet}
            disabled={generating}
          >
            {generating ? (
              <>
                <span className="button-spinner"></span>
                Generating...
              </>
            ) : (
              <>
                ✨ Generate AI Plan
              </>
            )}
          </button>
        </div>

        {/* ==============================================
            ERROR
        ============================================== */}

        {aiError && (
          <div className="meal-plan-ai-error">
            <strong>
              ⚠ {aiError}
            </strong>

            <button
              type="button"
              onClick={() => setAiError("")}
            >
              ×
            </button>
          </div>
        )}

        {/* ==============================================
            EMPTY STATE
        ============================================== */}

        {!dietPlan && !generating && (
          <section className="meal-plan-empty">
            <div className="empty-icon">
              ✨
            </div>

            <h2>
              Ready to build your diet?
            </h2>

            <p>
              Let AI create a personalized
              7-day nutrition plan based on
              your profile.
            </p>

            <button
              className="generate-plan-btn"
              onClick={handleGenerateDiet}
            >
              Generate My Diet
            </button>
          </section>
        )}

        {/* ==============================================
            GENERATING
        ============================================== */}

        {generating && (
          <section className="meal-plan-generating">
            <div className="large-spinner"></div>

            <h2>
              Creating your personalized diet...
            </h2>

            <p>
              AI is analyzing your goals,
              body information and nutrition
              preferences.
            </p>
          </section>
        )}

        {/* ==============================================
            DIET PLAN
        ============================================== */}

        {dietPlan && !generating && (
          <>
            {/* ==============================================
                DAY TABS - FIXED
            ============================================== */}

            <div className="meal-day-tabs">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`meal-day-tab ${
                    selectedDay === day
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedDay(day)
                  }
                >
                  {/* Desktop */}
                  <span className="day-full-name">
                    {day}
                  </span>

                  {/* Mobile */}
                  
                </button>
              ))}
            </div>

            {/* ==============================================
                CALORIE SUMMARY
            ============================================== */}

            <div className="meal-summary">

              {/* CALORIES */}

              <div className="meal-summary-card">
                <div className="summary-icon purple">
                  ♨
                </div>

                <div>
                  <p>
                    Daily Calories
                  </p>

                  <h2>
                    {totalCalories.toLocaleString()}
                    <small>
                      {" "}kcal
                    </small>
                  </h2>
                </div>
              </div>

              {/* PROTEIN */}

              <div className="meal-summary-card">
                <div className="summary-icon green">
                  P
                </div>

                <div>
                  <p>
                    Protein
                  </p>

                  <h2>
                    {totalProtein}g
                  </h2>
                </div>
              </div>

              {/* CARBS */}

              <div className="meal-summary-card">
                <div className="summary-icon orange">
                  C
                </div>

                <div>
                  <p>
                    Carbs
                  </p>

                  <h2>
                    {totalCarbs}g
                  </h2>
                </div>
              </div>

              {/* FAT */}

              <div className="meal-summary-card">
                <div className="summary-icon pink">
                  F
                </div>

                <div>
                  <p>
                    Fat
                  </p>

                  <h2>
                    {totalFat}g
                  </h2>
                </div>
              </div>

            </div>

            {/* ==============================================
                PROGRESS
            ============================================== */}

            <div className="nutrition-progress-card">
              <div className="progress-top">
                <div>
                  <h3>
                    Today's Nutrition
                  </h3>

                  <p>
                    {completedCount} of{" "}
                    {MEAL_TYPES.length} meals completed.
                  </p>
                </div>

                <strong>
                  {progress}%
                </strong>
              </div>

              <div className="nutrition-progress">
                <div
                  className="nutrition-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>

              <span className="remaining-calories">
                Water:{" "}
                {currentDay?.water_liters ?? "--"}{" "}
                liters
              </span>
            </div>

            {/* ==============================================
                MEALS SECTION
            ============================================== */}

            <div className="meals-section">

              <div className="section-heading">
                <div>
                  <h2>
                    {selectedDay}'s Meals
                  </h2>

                  <p>
                    Follow your personalized
                    meal schedule.
                  </p>
                </div>
              </div>

              {/* ==========================================
                  MEAL LIST
              ========================================== */}

              <div className="meal-list">
                {MEAL_TYPES.map((mealType) => {
                  const meal =
                    meals?.[mealType];

                  if (!meal) {
                    return null;
                  }

                  const mealKey =
                    getMealKey(
                      selectedDay,
                      mealType
                    );

                  const isCompleted =
                    completedMeals.includes(
                      mealKey
                    );

                  return (
                    <div
                      className={`meal-card ${
                        isCompleted
                          ? "completed"
                          : ""
                      }`}
                      key={mealType}
                    >

                      {/* ICON */}

                      <div className="meal-icon">
                        {
                          MEAL_ICONS[
                            mealType
                          ]
                        }
                      </div>

                      {/* INFO */}

                      <div className="meal-info">
                        <div className="meal-title-row">
                          <div>
                            <span className="meal-type">
                              {mealType}
                            </span>

                            <h3>
                              {meal.name || "Meal"}
                            </h3>
                          </div>

                          <span className="meal-time">
                            {mealType}
                          </span>
                        </div>

                        {/* DESCRIPTION */}

                        {meal.description && (
                          <p className="meal-description">
                            {meal.description}
                          </p>
                        )}

                        {/* NUTRITION */}

                        <div className="meal-nutrition">
                          <span>
                            🔥{" "}
                            {meal.calories ?? 0} kcal
                          </span>

                          <span>
                            Protein{" "}
                            {meal.protein_g ?? 0}g
                          </span>

                          <span>
                            Carbs{" "}
                            {meal.carbs_g ?? 0}g
                          </span>

                          <span>
                            Fat{" "}
                            {meal.fat_g ?? 0}g
                          </span>
                        </div>
                      </div>

                      {/* COMPLETE BUTTON */}

                      <button
                        type="button"
                        className={`meal-complete-btn ${
                          isCompleted
                            ? "completed"
                            : ""
                        }`}
                        onClick={() =>
                          toggleMealComplete(
                            mealType
                          )
                        }
                        aria-label={
                          isCompleted
                            ? `Mark ${mealType} as incomplete`
                            : `Mark ${mealType} as complete`
                        }
                      >
                        ✓
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* ==============================================
                DAILY TIP
            ============================================== */}

            {currentDay?.tip && (
              <div className="diet-tip-card">
                <div>
                  <span>
                    DAILY TIP
                  </span>

                  <p>
                    {currentDay.tip}
                  </p>
                </div>

                <strong>
                  💡
                </strong>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default MealPlan;
