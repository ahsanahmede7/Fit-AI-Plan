import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./SIdebar.css";
import { Logout } from "../tanstack/APIcall.js";

function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await Logout();

    if (success) {
      navigate("/login");
    }
  };

  return (
    <aside className="dashboard-sidebar">

      {/* BRAND */}

      <div className="dashboard-brand">

        <div className="dashboard-brand-icon">
          <span>+</span>
        </div>

        <div className="dashboard-brand-name">
          Fit<span>Plan</span> AI
        </div>

      </div>


      {/* NAVIGATION */}

      <nav className="dashboard-nav">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⌂</span>
          Dashboard
        </NavLink>


        <NavLink
          to="/meal-plan"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◈</span>
          Meal Plan
        </NavLink>


        <NavLink
          to="/workout"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">♧</span>
          Workout
        </NavLink>


        


        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">○</span>
          Profile
        </NavLink>

      </nav>


      {/* SIDEBAR BOTTOM */}

      <div className="dashboard-sidebar-bottom">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `dashboard-bottom-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>⚙</span>
          Settings
        </NavLink>


        <button
          onClick={handleLogout}
          className="dashboard-bottom-link logout"
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;

