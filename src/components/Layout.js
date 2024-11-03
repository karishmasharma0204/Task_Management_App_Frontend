import React, { useState } from "react";
import TaskBoard from "../components/TaskBoard";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import "../styles/Layout.css";
import Analytics from "../components/Analytics";
import Settings from "../components/Settings";

const Layout = () => {
  const [activeComponent, setActiveComponent] = useState("taskBoard");
  return (
    <div className="layout">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="main-content">
        {/* Conditionally render Header only if activeComponent is not 'analytics' && 'settings' */}
        {activeComponent !== "analytics" && activeComponent !== "settings" && (
          <Header />
        )}
        {activeComponent === "taskBoard" && <TaskBoard />}
        {activeComponent === "analytics" && <Analytics />}
        {activeComponent === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Layout;
