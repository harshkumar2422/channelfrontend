import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCreateNewAccount.css";
import { data, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { server } from "../../App";

const AdminCreateNewAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log("AdminCreateNewAccount component mounted");
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${server}/createuser`,
        formData
      );
      const { token, user } = response.data;

      // Store token and user

      localStorage.setItem("token", data.token);

      // Optional: Redirect to dashboard
      // window.location.href = "/dashboard";
      toast.success(data.message || "Account created successfully");
      navigate("/admin/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "User Already Exsist!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1>Welcome to VPVV</h1>
          <label htmlFor="name">Enter your name *</label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Enter your email *</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Enter a password *</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="signup-btn" type="submit">
            Create Admin Account
          </button>
        </form>
      </div>
      <div className="signup-vpvv-support">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="#ffd700"
            d="M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z"
          />
        </svg>
        Contact VPVV Support
      </div>
    </div>
  );
};

export default AdminCreateNewAccount;
