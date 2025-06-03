import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminLogin.css";
import { server } from "../../App";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${server}/login`, {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      toast.success("OTP sent!");

      // Navigate to channel-partner page
      navigate("/admin/channel-partner");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed!";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="signin-container">
        <div className="signin-form-container">
          <form className="signin-form" onSubmit={handleLogin}>
            <h1>Login to VPVV Portal</h1>

            <label htmlFor="email">Email address *</label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Enter password *</label>
            <input
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="signin-btn">
              Sign in
            </button>
          </form>
        </div>

        <div className="signin-vpvv-support">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              fill="#ffd700"
              d="M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z"
            />
          </svg>
          Contact VPVV Support
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
