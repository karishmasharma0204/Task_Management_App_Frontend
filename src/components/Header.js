import React, { useState } from "react";
import "../styles/Header.css";
import people from "../assets/People.png";
import Modal from "../components/AddPeopleModal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userName = localStorage.getItem("name") || "Guest";

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("default", { month: "short" });
    const year = today.getFullYear();

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month}, ${year}`;
  };

  return (
    <div className="header">
      <div className="header-left">
        <h2>Welcome! {userName}</h2>

        <div className="add-people" onClick={() => setIsModalOpen(true)}>
          <h1>Board</h1>
          <div>
            <img src={people} alt="add-people" className="add-people-icon" />
            <span className="add-people-span">Add People</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        <span>{getCurrentDate()}</span>{" "}
        <select>
          <option>Today</option>
          <option>This week</option>
          <option>This month</option>
        </select>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Header;
