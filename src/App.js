import React, { use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
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

export const server = "https://channelpartnerbackend.onrender.com/api/v1";

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  const Protected = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/admin" replace />;
  };
  const Protectedclient = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
  };

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
            path="company-list"
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
              <Protected>
                <UploadAadhar />
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
