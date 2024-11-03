import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import logo from "../assets/logo.png";
import blue_circle from "../assets/blue_circle.png";
import red_circle from "../assets/red_circle.png";
import green_circle from "../assets/green_circle.png";
import "../styles/taskCardWithId.css";

const Dashboard = () => {
  const { state } = useContext(AppContext);
  const sharedTask = state.sharedTask;

  if (!sharedTask)
    return <p>Public View..Please Click Share to see the card here...!!!</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${month} ${day}${suffix}`;
  };

  return (
    <div className="container">
      <div className="public-slider-container">
        <div className="public-sidebar-logo">
          <img src={logo} alt="Logo" className="sidebar-logo-icon" />
          <h2>Pro Manage</h2>
        </div>
      </div>

      <div className="task-card-wrapper">
        <div className="public-task-card">
          {/* Priority and assignee */}
          <div className="header-row">
            <div className="priority-section">
              <div className="priority">
                <img
                  src={
                    sharedTask.priority === "high"
                      ? red_circle
                      : sharedTask.priority === "moderate"
                      ? blue_circle
                      : green_circle
                  }
                  alt={`${sharedTask.priority} priority`}
                  className="priority-icon"
                />
                <span className="priority-label">
                  {sharedTask.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
            {/* User Badge Section */}
            <span className="user-badge">
              {sharedTask.assign ? sharedTask.assign[0].toUpperCase() : "?"}
            </span>
          </div>

          {/* Title */}
          <h3 className="data-title">{sharedTask.title}</h3>

          {/* Render checklist items */}
          {sharedTask.checklist.map((item, index) => (
            <div key={index} className="checklist-item">
              <input type="checkbox" checked={item.completed} readOnly />
              <span>{item.text}</span>
            </div>
          ))}

          {/* Due Date */}
          <div className="action-buttons">
            <p>Due Date: </p>
            <span
              className={`due-date ${
                sharedTask.status === "done"
                  ? "done-due-date"
                  : new Date(sharedTask.dueDate) < new Date()
                  ? "overdue-due-date"
                  : "upcoming-due-date"
              }`}
            >
              {formatDate(sharedTask.dueDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
