import React, { useState, useEffect } from "react";
import { updatePassword } from "../services/auth";
import "../styles/Settings.css";
import nameIcon from "../assets/name.png";
import emailIcon from "../assets/icon.png";
import eyeIcon from "../assets/eye-icon.png";
import lockIcon from "../assets/lock.png";
import eyeOffIcon from "../assets/eye-off-icon.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(true);

  const [userData, setUserData] = useState({
    name: null,
    email: null,
    password: null,
    newPassword: null
  });

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };
  console.log(userData);

  //Update password
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, newPassword } = userData;

      const response = await updatePassword({
        name,
        email,
        password,
        newPassword
      });

      if (response.status === 200) {
        toast.success("Password Updated Successfully!");

        Navigate("/login");
      } else {
        toast.error("Failed to update password. Please check your details.");
      }
    } catch (error) {
      toast.error(
        "Failed to update password. Please check your details and try again."
      );
      console.error("Detailed error:", error.message);
    }
  };

  //To show old password
  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible(!isOldPasswordVisible);
    setIconVisible(!iconVisible);
  };

  //To show New password
  const toggleNewPasswordVisible = () => {
    setNewPasswordVisible(!isNewPasswordVisible);
    setIconVisible(!iconVisible);
  };

  return (
    <>
      <h1 className="settings-header">Settings</h1>
      <form className="settings-form" onSubmit={handleUpdate}>
        <div className="settings-form-group">
          <div className="settings-input-with-icon">
            <img
              src={nameIcon}
              alt="Name Icon"
              className="settings-input-icon1"
            />
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={userData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-form-group">
          <div className="settings-input-with-icon">
            <img
              src={emailIcon}
              alt="Email Icon"
              className="settings-input-icon1"
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Update Email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-form-group">
          <div className="settings-input-with-icon">
            <img
              src={lockIcon}
              alt="Lock Icon"
              className="settings-input-icon1"
            />
            <input
              type={isOldPasswordVisible ? "text" : "password"}
              id="oldPassword"
              name="password"
              placeholder="Old Password"
              value={userData.password}
              onChange={handleChange}
            />
            <img
              src={isOldPasswordVisible ? eyeOffIcon : eyeIcon}
              alt="Eye Icon"
              className="settings-input-icon2"
              onClick={toggleOldPasswordVisibility}
            />
          </div>
        </div>

        <div className="settings-form-group">
          <div className="settings-input-with-icon">
            <img
              src={lockIcon}
              alt="Lock Icon"
              className="settings-input-icon1"
            />
            <input
              type={isNewPasswordVisible ? "text" : "password"}
              id="newPassword"
              placeholder="New Password"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChange}
            />
            <img
              src={isNewPasswordVisible ? eyeOffIcon : eyeIcon}
              alt="Eye Icon"
              className="settings-input-icon2"
              onClick={toggleNewPasswordVisible}
            />
          </div>
        </div>

        <button type="submit" className="update-button">
          Update
        </button>
      </form>
    </>
  );
};

export default Settings;
