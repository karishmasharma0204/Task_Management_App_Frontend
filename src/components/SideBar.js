import React, { useState } from "react";
import "../styles/SlideBar.css";
import logo from "../assets/logo.png";
import board from "../assets/board.png";
import settings from "../assets/settings.png";
import analytics from "../assets/analytics.png";
import logout from "../assets/Logout.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveComponent }) => {
  const [isLogoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLogoutPopupOpen(false);
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="sidebar-logo-icon" />
        <h2>Pro Manage</h2>
      </div>
      <ul className="sidebar-menu">
        <li
          className="menu-item"
          onClick={() => setActiveComponent("taskBoard")}
        >
          <img src={board} alt="board" className="board-icon" /> Board
        </li>
        <li
          className="menu-item"
          onClick={() => setActiveComponent("analytics")}
        >
          <img src={analytics} alt="analytics" className="analytics-icon" />{" "}
          Analytics
        </li>
        <li
          className="menu-item"
          onClick={() => setActiveComponent("settings")}
        >
          <img src={settings} alt="settings" className="settings-icon" />{" "}
          Settings
        </li>
      </ul>
      <div className="logout-section">
        <img src={logout} alt="Logout" className="logout-icon" />
        <button className="logout-btn" onClick={() => setLogoutPopupOpen(true)}>
          Log out
        </button>
      </div>

      {/* Logout Confirmation Popup */}
      {isLogoutPopupOpen && (
        <div className="logout-popup">
          <div className="logout-popup-content">
            <h3>Are you sure you want to Logout?</h3>
            <button className="logout-confirm-btn" onClick={handleLogout}>
              Yes, Logout
            </button>
            <button
              className="logout-cancel-btn"
              onClick={() => setLogoutPopupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
