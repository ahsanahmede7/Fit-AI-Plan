import React, { useEffect } from "react";
import "./UserProfile.css";

import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../redux/userprofileslice";

import { supabase } from "../supabase/supabase";
import { useNavigate } from "react-router-dom";

import { getLoggedInUser, Userdata } from "../tanstack/APIcall";

function UserProfile() {

  // ========================================
  // REDUX
  // ========================================

  const dispatch = useDispatch();

  const formData = useSelector(
    (state) => state.userprofile
  );


  // ========================================
  // NAVIGATION
  // ========================================

  const navigate = useNavigate();


  // ========================================
  // GET LOGGED IN USER
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
  // FIRST TIME / EXISTING USER CHECK
  // ========================================

  useEffect(() => {

    if (!loggedInUser?.id) {
      return;
    }

    // User profile already exists
    if (profile) {

      console.log("Existing profile:", profile);

      // Save profile data into Redux
      dispatch(
        updateField({
          key: "id",
          value: profile.id,
        })
      );

      dispatch(
        updateField({
          key: "fullName",
          value: profile.fullName || "",
        })
      );

      dispatch(
        updateField({
          key: "email",
          value: profile.email || loggedInUser.email || "",
        })
      );

      dispatch(
        updateField({
          key: "age",
          value: profile.age || "",
        })
      );

      dispatch(
        updateField({
          key: "gender",
          value: profile.gender || "Male",
        })
      );

      dispatch(
        updateField({
          key: "height",
          value: profile.height || "",
        })
      );

      dispatch(
        updateField({
          key: "weight",
          value: profile.weight || "",
        })
      );

      dispatch(
        updateField({
          key: "targetWeight",
          value: profile.targetWeight || "",
        })
      );

      dispatch(
        updateField({
          key: "goal",
          value: profile.goal || "",
        })
      );

      dispatch(
        updateField({
          key: "activityLevel",
          value:
            profile.activityLevel ||
            "Moderately Active",
        })
      );

      dispatch(
        updateField({
          key: "diet",
          value:
            profile.diet ||
            "No Preference",
        })
      );


      // Existing user → Dashboard
      navigate("/dashboard");
    }

  }, [
    loggedInUser,
    profile,
    dispatch,
    navigate,
  ]);


  // ========================================
  // SAVE USER ID IN REDUX
  // ========================================

  useEffect(() => {

    if (loggedInUser?.id) {

      dispatch(
        updateField({
          key: "id",
          value: loggedInUser.id,
        })
      );

    }

  }, [loggedInUser, dispatch]);


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    dispatch(
      updateField({
        key: name,
        value: value,
      })
    );

  };


  // ========================================
  // HANDLE SUBMIT
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!loggedInUser?.id) {

      alert("User is not logged in.");

      return;
    }


    // ========================================
    // PROFILE DATA
    // ========================================

    const profileData = {

      id: loggedInUser.id,

      fullName: formData.fullName,

      email:
        formData.email ||
        loggedInUser.email,

      age: Number(formData.age),

      gender: formData.gender,

      height: Number(formData.height),

      weight: Number(formData.weight),

      targetWeight:
        Number(formData.targetWeight),

      goal: formData.goal,

      activityLevel:
        formData.activityLevel,

      diet: formData.diet,

    };


    console.log(
      "Data going to Supabase:",
      profileData
    );


    // ========================================
    // SAVE / UPDATE SUPABASE
    // ========================================

    const { data, error } = await supabase

      .from("userprofile")

      .upsert(
        [profileData],
        {
          onConflict: "id",
        }
      )

      .select();


    // ========================================
    // ERROR
    // ========================================

    if (error) {

      console.log(
        "Supabase Error:",
        error
      );

      alert(error.message);

      return;
    }


    // ========================================
    // SUCCESS
    // ========================================

    console.log(
      "Profile saved:",
      data
    );

    alert(
      "Profile saved successfully!"
    );


    // Dashboard
    navigate("/dashboard");

  };


  // ========================================
  // LOADING USER
  // ========================================

  if (userLoading) {

    return (
      <div className="profile-loading">

        <h2>
          Loading user...
        </h2>

      </div>
    );

  }


  // ========================================
  // LOADING PROFILE
  // ========================================

  if (profileLoading) {

    return (
      <div className="profile-loading">

        <h2>
          Checking your profile...
        </h2>

      </div>
    );

  }


  // ========================================
  // ERROR USER
  // ========================================

  if (userError) {

    return (
      <div className="profile-error">

        <h2>
          Unable to load user
        </h2>

        <p>
          {userError.message}
        </p>

      </div>
    );

  }


  // ========================================
  // ERROR PROFILE
  // ========================================

  if (profileError) {

    console.log(
      "Profile error:",
      profileError
    );

  }


  // ========================================
  // UI
  // ========================================

  return (

    <div className="profile-page">

      {/* ========================================
          NAVBAR
      ======================================== */}

      <nav className="profile-navbar">

        <div className="logo">
          Fit<span>Plan</span> AI
        </div>


        <div className="nav-links">

          <a href="#">
            Dashboard
          </a>

          <a href="#">
            Meal Plan
          </a>

          <a href="#">
            Workout
          </a>

          <a
            className="active"
            href="#"
          >
            Profile
          </a>

        </div>


        <div className="nav-avatar">

          {formData.fullName

            ? formData.fullName
                .charAt(0)
                .toUpperCase()

            : "A"}

        </div>

      </nav>


      {/* ========================================
          MAIN
      ======================================== */}

      <main className="profile-container">


        {/* PAGE HEADING */}

        <div className="page-heading">

          <h1>
            My Profile
          </h1>

          <p>
            Tell us about yourself so AI can
            personalize your fitness plan.
          </p>

        </div>


        {/* ========================================
            FORM
        ======================================== */}

        <form onSubmit={handleSubmit}>


          {/* ========================================
              PROFILE + BODY STATS
          ======================================== */}

          <div className="profile-grid">


            {/* PROFILE INFORMATION */}

            <div className="profile-card">

              <div className="card-title">

                <h2>
                  Profile Information
                </h2>

                <p>
                  Your basic personal information
                </p>

              </div>


              {/* AVATAR */}

              <div className="avatar-section">

                <div className="big-avatar">

                  {formData.fullName

                    ? formData.fullName
                        .charAt(0)
                        .toUpperCase()

                    : "A"}

                </div>


                <div>

                  <h3>

                    {formData.fullName ||
                      "Your Name"}

                  </h3>

                  <p>
                    FitPlan AI Member
                  </p>

                </div>

              </div>


              {/* FULL NAME */}

              <div className="input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={
                    formData.fullName || ""
                  }
                  onChange={handleChange}
                />

              </div>


              {/* EMAIL */}

              <div className="input-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={
                    formData.email ||
                    loggedInUser?.email ||
                    ""
                  }
                  onChange={handleChange}
                />

              </div>


              {/* ACTIVITY LEVEL */}

              <div className="input-group">

                <label>
                  Activity Level
                </label>

                <select
                  name="activityLevel"
                  value={
                    formData.activityLevel ||
                    "Moderately Active"
                  }
                  onChange={handleChange}
                >

                  <option value="Sedentary">
                    Sedentary
                  </option>

                  <option value="Lightly Active">
                    Lightly Active
                  </option>

                  <option value="Moderately Active">
                    Moderately Active
                  </option>

                  <option value="Very Active">
                    Very Active
                  </option>

                  <option value="Extremely Active">
                    Extremely Active
                  </option>

                </select>

              </div>

            </div>


            {/* ========================================
                BODY STATS
            ======================================== */}

            <div className="profile-card">

              <div className="card-title">

                <h2>
                  Body Stats
                </h2>

                <p>
                  Help us understand your current
                  body condition
                </p>

              </div>


              {/* AGE + GENDER */}

              <div className="two-column">


                {/* AGE */}

                <div className="input-group">

                  <label>
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    placeholder="e.g. 22"
                    value={
                      formData.age || ""
                    }
                    onChange={handleChange}
                  />

                </div>


                {/* GENDER */}

                <div className="input-group">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      formData.gender ||
                      "Male"
                    }
                    onChange={handleChange}
                  >

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              {/* HEIGHT + WEIGHT */}

              <div className="two-column">


                {/* HEIGHT */}

                <div className="input-group">

                  <label>
                    Height
                  </label>

                  <div className="input-with-unit">

                    <input
                      type="number"
                      name="height"
                      placeholder="175"
                      value={
                        formData.height || ""
                      }
                      onChange={handleChange}
                    />

                    <span>
                      cm
                    </span>

                  </div>

                </div>


                {/* CURRENT WEIGHT */}

                <div className="input-group">

                  <label>
                    Current Weight
                  </label>

                  <div className="input-with-unit">

                    <input
                      type="number"
                      name="weight"
                      placeholder="75"
                      value={
                        formData.weight || ""
                      }
                      onChange={handleChange}
                    />

                    <span>
                      kg
                    </span>

                  </div>

                </div>

              </div>


              {/* TARGET WEIGHT */}

              <div className="input-group">

                <label>
                  Target Weight
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    name="targetWeight"
                    placeholder="68"
                    value={
                      formData.targetWeight || ""
                    }
                    onChange={handleChange}
                  />

                  <span>
                    kg
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* ========================================
              FITNESS GOAL
          ======================================== */}

          <div className="profile-card goal-card">

            <div className="card-title">

              <h2>
                What's your fitness goal?
              </h2>

              <p>
                Choose the goal you want to achieve
              </p>

            </div>


            <div className="goal-options">


              {/* LOSE WEIGHT */}

              <button
                type="button"
                className={
                  formData.goal === "Lose Weight"
                    ? "goal selected"
                    : "goal"
                }
                onClick={() =>
                  dispatch(
                    updateField({
                      key: "goal",
                      value: "Lose Weight",
                    })
                  )
                }
              >

                <div className="goal-icon">
                  🔥
                </div>

                <div>

                  <strong>
                    Lose Weight
                  </strong>

                  <p>
                    Burn fat & become leaner
                  </p>

                </div>

              </button>


              {/* BUILD MUSCLE */}

              <button
                type="button"
                className={
                  formData.goal === "Build Muscle"
                    ? "goal selected"
                    : "goal"
                }
                onClick={() =>
                  dispatch(
                    updateField({
                      key: "goal",
                      value: "Build Muscle",
                    })
                  )
                }
              >

                <div className="goal-icon">
                  💪
                </div>

                <div>

                  <strong>
                    Build Muscle
                  </strong>

                  <p>
                    Gain muscle & strength
                  </p>

                </div>

              </button>


              {/* MAINTAIN */}

              <button
                type="button"
                className={
                  formData.goal === "Maintain"
                    ? "goal selected"
                    : "goal"
                }
                onClick={() =>
                  dispatch(
                    updateField({
                      key: "goal",
                      value: "Maintain",
                    })
                  )
                }
              >

                <div className="goal-icon">
                  ⚖️
                </div>

                <div>

                  <strong>
                    Maintain
                  </strong>

                  <p>
                    Stay healthy & fit
                  </p>

                </div>

              </button>

            </div>

          </div>


          {/* ========================================
              DIETARY PREFERENCE
          ======================================== */}

          <div className="profile-card">

            <div className="card-title">

              <h2>
                Dietary Preference
              </h2>

              <p>
                Choose your preferred diet
              </p>

            </div>


            <div className="diet-options">

              {[
                "No Preference",
                "Vegetarian",
                "Vegan",
                "High Protein",
              ].map((diet) => (

                <label
                  key={diet}
                  className="radio-option"
                >

                  <input
                    type="radio"
                    name="diet"
                    value={diet}
                    checked={
                      formData.diet === diet
                    }
                    onChange={handleChange}
                  />

                  <span>
                    {diet}
                  </span>

                </label>

              ))}

            </div>

          </div>


          {/* ========================================
              SUBMIT
          ======================================== */}

          <div className="submit-section">

            <button
              type="submit"
              className="save-button"
            >

              Save & Generate My Plan

              <span>
                →
              </span>

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default UserProfile;
