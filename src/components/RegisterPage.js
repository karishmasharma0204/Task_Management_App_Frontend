import { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/Group.png";
import back from "../assets/Back.png";
import email from "../assets/icon.png";
import password from "../assets/lock.png";
import eyeIcon from "../assets/eye-icon.png";
import eyeOffIcon from "../assets/eye-off-icon.png";
import name from "../assets/name.png";
import "../styles/register.css";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all fields are filled
    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Check if password and confirm password match
    if (userData.password !== userData.confirmPassword) {
      toast.error("Please Enter The Same Password.");
      setLoading(false);
      return;
    }

    try {
      const { name, email, password } = userData;
      const response = await register({ name, email, password });
      console.log(response);
      if (response.status === 200) {
        toast.success("User created successfully");
        console.log("user created successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleloginPage = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo-container">
          <img src={back} alt="Background" className="background-image" />
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1 className="main-heading">Welcome aboard my friend</h1>
        <h2 className="sub-heading">Just a couple of clicks and we start</h2>
      </div>
      {/* Right Section */}
      <div className="right-section">
        <div className="form-container">
          <h2 className="login-heading">Register</h2>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <input
                name="name"
                value={userData.name}
                onChange={handleChange}
                type="text"
                id="name"
                required
                placeholder="Name"
                className="input-field name-input"
              />
              <img src={name} alt="Name Icon" className="input-icon1" />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                type="email"
                id="email"
                required
                placeholder="Email"
                className="input-field email-input"
              />
              <img src={email} alt="Email Icon" className="input-icon1" />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <input
                name="password"
                value={userData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Password"
                className="input-field password-input"
              />
              <img
                src={showPassword ? eyeOffIcon : eyeIcon}
                alt="Toggle Password Visibility"
                className="toggle-password-icon1"
                onClick={togglePasswordVisibility}
              />
              <img src={password} alt="Password Icon" className="input-icon1" />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <input
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                required
                placeholder="Confirm Password"
                className="input-field confirm-password-input"
              />
              <img
                src={showConfirmPassword ? eyeOffIcon : eyeIcon}
                alt="Toggle Confirm Password Visibility"
                className="toggle-password-icon1"
                onClick={toggleConfirmPasswordVisibility}
              />
              <img src={password} alt="Password Icon" className="input-icon1" />
            </div>

            {/* Register Button */}
            <button
              disabled={loading}
              type="submit"
              className="register-button1"
            >
              Register
            </button>

            {/* Link to Log in */}
            <button
              type="button"
              className="create-account1"
              onClick={handleRegisterClick}
            >
              Have an account?
            </button>

            {/* Log in Button */}
            <button
              type="button"
              className="login-button1"
              onClick={handleloginPage}
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
