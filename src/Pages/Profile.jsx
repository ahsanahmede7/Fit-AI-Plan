import React from "react";
import "./Profile.css";

import {
  getLoggedInUser,
  Userdata,
} from "../tanstack/APIcall";
import Sidebar from "./Sidebar";


function Profile() {

  // ==========================================
  // GET LOGGED IN USER
  // ==========================================

  const {
    data: user,
    isLoading: userLoading,
    isError: userIsError,
    error: userError,
  } = getLoggedInUser();


  console.log("USER:", user);


  // ==========================================
  // GET USER ID
  // ==========================================

  const userId = user?.id;


  console.log("USER ID:", userId);


  // ==========================================
  // GET USER PROFILE
  // ==========================================

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileIsError,
    error: profileError,
  } = Userdata(userId);


  console.log("PROFILE:", profile);


  // ==========================================
  // USER LOADING
  // ==========================================

  if (userLoading) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>Loading User...</h2>

          <p>
            Please wait while we load your account.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // USER ERROR
  // ==========================================

  if (userIsError) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>User Error</h2>

          <p>
            {userError?.message || "Unable to load user"}
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // USER NOT FOUND
  // ==========================================

  if (!user) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>User Not Found</h2>

          <p>
            Please login again.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // PROFILE LOADING
  // ==========================================

  if (profileLoading) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>Loading Profile...</h2>

          <p>
            Fetching your profile information.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // PROFILE ERROR
  // ==========================================

  if (profileIsError) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>Profile Error</h2>

          <p>
            {profileError?.message || "Unable to load profile"}
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!profile) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>No Profile Found</h2>

          <p>
            Please complete your profile first.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // PROFILE UI
  // ==========================================

  return (

    <div className="profile-page">
        <Sidebar/>

      <div className="profile-container">


        {/* =====================================
            PROFILE HEADER
        ====================================== */}

        <div className="profile-header">

          <div className="profile-avatar">

            {profile.fullName
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>


          <div className="profile-header-info">

            <h1>
              {profile.fullName || "User"}
            </h1>

            <p>
              {profile.email || user.email || "No email"}
            </p>

          </div>

        </div>



        {/* =====================================
            PERSONAL INFORMATION
        ====================================== */}

        <div className="profile-section">

          <h2>
            Personal Information
          </h2>


          <div className="profile-grid">


            <div className="profile-item">

              <span>
                Full Name
              </span>

              <strong>
                {profile.fullName || "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Email
              </span>

              <strong>
                {profile.email ||
                  user.email ||
                  "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Age
              </span>

              <strong>
                {profile.age
                  ? `${profile.age} years`
                  : "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Gender
              </span>

              <strong>
                {profile.gender || "Not provided"}
              </strong>

            </div>


          </div>

        </div>



        {/* =====================================
            BODY INFORMATION
        ====================================== */}

        <div className="profile-section">

          <h2>
            Body Information
          </h2>


          <div className="profile-grid">


            <div className="profile-item">

              <span>
                Height
              </span>

              <strong>
                {profile.height
                  ? `${profile.height} cm`
                  : "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Current Weight
              </span>

              <strong>
                {profile.weight
                  ? `${profile.weight} kg`
                  : "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Target Weight
              </span>

              <strong>
                {profile.targetWeight
                  ? `${profile.targetWeight} kg`
                  : "Not provided"}
              </strong>

            </div>


          </div>

        </div>



        {/* =====================================
            FITNESS INFORMATION
        ====================================== */}

        <div className="profile-section">

          <h2>
            Fitness Information
          </h2>


          <div className="profile-grid">


            <div className="profile-item">

              <span>
                Goal
              </span>

              <strong>
                {profile.goal || "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Activity Level
              </span>

              <strong>
                {profile.activityLevel ||
                  "Not provided"}
              </strong>

            </div>



            <div className="profile-item">

              <span>
                Diet Preference
              </span>

              <strong>
                {profile.diet || "Not provided"}
              </strong>

            </div>


          </div>

        </div>


      </div>

    </div>

  );
}


export default Profile;