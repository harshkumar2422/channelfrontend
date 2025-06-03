import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./CompanyList.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { server } from "../../App";


const CompanyList = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (description) => {
    setSelectedDescription(description);
    setShow(true);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          `${server}/getcompanybychannel`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let sortedCompanies = data.company || [];

        // Sort by createdAt from newest to oldest
        sortedCompanies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCompanies(sortedCompanies);
        console.log("data", sortedCompanies);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        alert("Failed to fetch companies. Check token or backend.");
      }
    };

    fetchCompanies();
  }, []);

  // const viewaadharhandler = (url) => {
  //   if (url) {
  //     window.open(url, "_blank");
  //   } else {
  //     alert("Aadhar card not available.");
  //   }
  // };

  const viewportfoliohandler = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("Portfolio not available.");
    }
  };

  return (
    <div style={{ display: "flex" }} className="main-container">
      <Sidebar />
      <div className="company-listed-conatiner">
        <div className="container-list-heading">
          <h1>Registered Business List</h1>
        </div>
        <div className="companydata-headlinelist">
          <Table bordered className="compnaydata-tabel">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Company Name</th>
                <th>Owner Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Pin Code</th>
                <th>Company Description</th>
                <th>Portfolio</th>
                <th>Upload Aadhar Card</th>
                <th>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((comp, index) => (
                <tr key={comp._id}>
                  <td>{index + 1}</td>
                  <td>{comp.name}</td>
                  <td>{comp.owner}</td>
                  <td>{comp.email}</td>
                  <td>{comp.phone}</td>
                  <td>{comp.address}</td>
                  <td>{comp.city}</td>
                  <td>{comp.state}</td>
                  <td>{comp.pincode}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleShow(comp.description)}
                    >
                      Preview
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => viewportfoliohandler(comp.Portfolio?.url)}
                    >
                      View
                    </Button>
                  </td>
                  <td>
                    {comp.Status === "Initial Approved" ? (
                      <Button variant="secondary"
                      onClick={() => navigate(`/upload-aadhar/${comp._id}`)}

                      >Upload Aadhar</Button>
                    ) : (
                      <span style={{ color: "gray" }}>Not Available</span>
                    )}
                  </td>
                  <td>
                    <Button variant="warning">{comp.Status}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Company Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedDescription}</Modal.Body>
      </Modal>
    </div>
  );
};

export default CompanyList;
