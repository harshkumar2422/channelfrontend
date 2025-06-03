import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { server } from "../../App";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Spinner state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${server}/loginchannel`, {
        email,
        password,
      });

      console.log("data", data);
      
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/otpconfirmation");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form-container">
        <form className="signin-form" onSubmit={handleSubmit}>
          <h1>Login to VPVV Portal</h1>
          <label htmlFor="email">Email address *</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <label htmlFor="password">Enter password *</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span> // 👇 Add spinner CSS below
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
      <div className="signin-vpvv-support">
        {/* ... SVG and support text ... */}
        Contact VPVV Support
      </div>
    </div>
  );
};

export default Login;
