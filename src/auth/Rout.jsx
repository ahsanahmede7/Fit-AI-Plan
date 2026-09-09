import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "../Pages/LandingPage";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "../Pages/UserProfile";
import Dashboard from "../Pages/Dashboard";
import MealPlan from "../Pages/MeatPlan";
import Workout from "../Pages/Workout";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPaswword";
import Profile from "../Pages/Profile";

import { getLoggedInUser, Userdata } from "../tanstack/APIcall";
import ErrorPage from "../ErrorPage";

function Rout() {

  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />
      <Route
        path="*"
        element={<ErrorPage/>}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<SignUp />}
      />

      {/* Protected Routes */}

      <Route
        path="/userprofile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile  />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/meal-plan"
        element={
          <ProtectedRoute>
            <MealPlan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <Workout />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default Rout;