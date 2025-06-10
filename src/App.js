import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import CompanyForm from "./Components/CompanyForm/CompanyForm";
import CompanyList from "./Components/CompanyList/CompanyList";
import Login from "./Components/LoginPage/Login";
import ChannelPartner from "./Components/ChannelPartner/ChannelPartner";
import SinglePartnerData from "./Components/SinglePartnerData/SinglePartnerData";
import AllListedData from "./Components/AllListedData/AllListedData";
import MoreInformation from "./Components/MoreInformation/MoreInformation";
import AdminLogin from "./Components/AdminLogin/AdminLogin";
import toast, { Toaster } from "react-hot-toast";
import OtpPage from "./Components/OtpPage/OtpPage";
import AdminOtpPage from "./Components/AdminOtpPage/AdminOtpPage";
import CreateNewAccount from "./Components/CreateNewAccount/CreateNewAccount";
import AdminCreateNewAccount from "./Components/AdminCreateNewAccount/AdminCreateNewAccount";
import UploadAadhar from "./Components/UploadAadharCard/UploadAadhar";
import AddVistorsEntry from "./Components/AddVistorsEntry/AddVistorsEntry";
import VisitorsEntrylog from "./Components/VisitorsEntryLog/VisitorsEntrylog";

export const server = "https://channelpartnerbackend.onrender.com/api/v1";

//https://channelpartnerbackend.onrender.com/api/v1

// Secure token check
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return false;
  }
};

const Protected = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

const Protectedclient = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const App = () => {
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/otpconfirmation"
            element={
              <Protectedclient>
                <OtpPage />
              </Protectedclient>
            }
          />
          <Route path="/admin/otpconfirmation" element={<AdminOtpPage />} />
          <Route path="/create-new-account" element={<CreateNewAccount />} />
          <Route
            path="/admin-create-new-account"
            element={<AdminCreateNewAccount />}
          />
          <Route
            path="/company-form"
            element={
              <Protectedclient>
                <CompanyForm />
              </Protectedclient>
            }
          />
          <Route
            path="/company-list"
            element={
              <Protectedclient>
                <CompanyList />
              </Protectedclient>
            }
          />
          <Route
            path="/admin/channel-partner"
            element={
              <Protected>
                <ChannelPartner />
              </Protected>
            }
          />
          <Route
            path="/admin/all-listed-data"
            element={
              <Protected>
                <AllListedData />
              </Protected>
            }
          />
          <Route
            path="/admin/information/:id"
            element={
              <Protected>
                <MoreInformation />
              </Protected>
            }
          />
          <Route
            path="/admin/channel-partner/:id"
            element={
              <Protected>
                <SinglePartnerData />
              </Protected>
            }
          />
          <Route
            path="/upload-aadhar/:id"
            element={
              <Protectedclient>
                <UploadAadhar />
              </Protectedclient>
            }
          />

          <Route
            path="/admin/addvisitors"
            element={
              <Protected>
                <AddVistorsEntry />
              </Protected>
            }
          />
          <Route
            path="/admin/vistiorentrylog"
            element={
              <Protected>
                <VisitorsEntrylog />
              </Protected>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
