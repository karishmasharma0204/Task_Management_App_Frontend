import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/Group.png";
import back from "../assets/Back.png";
import email from "../assets/icon.png";
import password from "../assets/lock.png";
import eyeIcon from "../assets/eye-icon.png";
import eyeOffIcon from "../assets/eye-off-icon.png";
import "../styles/login.css";

export default function Login() {
  const [userData, setUserData] = useState({
    email: null,
    password: null
  });
  const [loading, setLoading] = useState(false);
  const [iconVisible, setIconVisible] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  //Submit the details
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!userData.email || !userData.password) {
      return;
    }
    try {
      const { name, email, password } = userData;
      const response = await login({ name, email, password });
      console.log(response);
      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        console.log("User logged in successfully");
        toast.success("User logged in successfully");
        setTimeout(() => {
          navigate("/board");
        }, 1500);
      }
    } catch (error) {
      toast.error("login failed");
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleRegister = () => {
    navigate("/register");
    console.log("reg");
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setIconVisible(!iconVisible);
  };
  return (
    <div className="login-container">
      <div className="left-section">
        <div className="logo-container">
          <img src={back} alt="Background" className="background-image" />
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1 className="main-heading">Welcome aboard my friend</h1>
        <h2 className="sub-heading">just a couple of clicks and we start</h2>
      </div>
      <div className="right-section">
        <div className="login-form">
          <h2 className="login-heading">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="Email"
                className="input-field email-input"
              />
              <img src={email} alt="Email Icon" className="input-icon" />
            </div>
            <div className="form-group">
              <input
                name="password"
                value={userData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="input-field password-input"
              />
              <img
                src={showPassword ? eyeOffIcon : eyeIcon}
                alt="Toggle Password Visibility"
                className="toggle-password-icon"
                onClick={togglePasswordVisibility}
              />
              <img
                src={password}
                alt="Password Icon"
                className={`input-icon ${iconVisible ? "" : "hidden"}`}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="login-button"
              onClick={handleSubmit}
            >
              Log in
            </button>
            <button
              type="button"
              className="create-account"
              onClick={handleRegisterClick}
            >
              Have no account yet?
            </button>
          </form>
          <button className="register-button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
       
    </div>
  );
}
