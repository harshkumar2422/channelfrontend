import React, { useEffect, useState } from "react";
import "./MoreInformation.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-bootstrap/Modal";
import { server } from "../../App";

const MoreInformation = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { id } = useParams(); // Get company ID from route
  const [company, setCompany] = useState(null);
  const [status, setStatus] = useState(""); // for status tracking
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${server}/getcompany/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("ress", res);

        setCompany(res.data.company);
      } catch (error) {
        toast.error("Failed to fetch company details");
        console.error(error);
      }
    };

    fetchCompany();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${server}/approvalcompany/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Status updated to ${newStatus}`);
      setStatus(newStatus);
      setCompany((prev) => ({ ...prev, status: newStatus }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!company) return <p>Loading...</p>;

  const viewportfolio = (url) => {
    window.open(url, "_blank"); // Open portfolio in a new tab
  };

  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />
      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading">
          <h1>Detailed Overview</h1>
        </div>
        <div className="company-form">
          <Form className="admin-form">
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Company Name</Form.Label>
                <p>{company.name}</p>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Director / Proprietor Name</Form.Label>
                <p>{company.owner}</p>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <p>{company.email}</p>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Phone Number</Form.Label>
                <p>{company.phone}</p>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Company Mailing Address</Form.Label>
              <p>{company.address}</p>
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>City</Form.Label>
                <p>{company.city}</p>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>State</Form.Label>
                <p>{company.state}</p>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Pin Code</Form.Label>
                <p>{company.pincode}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Date & Time</Form.Label>
                <p>{new Date(company.createdAt).toLocaleString()}</p>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Company Description</Form.Label>
              <p>{company.description}</p>
            </Form.Group>
            <div className="admin-information-btn-continer">
              <Button
                variant="primary"
                className="admin-form-btn"
                onClick={() => viewportfolio(company.Portfolio?.url)}
              >
                View Portfolio
              </Button>
              {/* <Button
                variant="primary"
                className="admin-form-btn"
                onClick={() => viewportfolio(company.Aadhar?.url)}
              >
                View Aadhars
              </Button> */}
              <Button
                variant="primary"
                onClick={handleShow}
                className="admin-form-btn"
              >
                View Aadhars
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Aadhar Card Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {company.Aadhar?.length > 1 ? (
                    company.Aadhar.slice(1).map((Aadhar, index) => (
                      <Button
                        key={index}
                        variant="primary"
                        className="admin-form-btn"
                        style={{ marginBottom: "10px" }}
                        onClick={() => viewportfolio(Aadhar.url)}
                      >
                        {index + 1}. Aadhar Card
                      </Button>
                    ))
                  ) : (
                    <p>No Aadhar card uploaded</p>
                  )}
                </Modal.Body>
              </Modal>
            </div>

            <div className="admin-information-btn-continer">
              <Button
                variant="warning"
                className="admin-form-btn"
                onClick={() => handleStatusChange("Initial Approved")}
                disabled={loading || company.Status === "Initial Approved"}
              >
                Initial Approval Done
              </Button>
              <Button
                variant="success"
                className="admin-form-btn"
                onClick={() => handleStatusChange("Due Diligence Approved")}
                disabled={
                  loading || company.Status === "Due Diligence Approved"
                }
              >
                Due Diligence Approved
              </Button>
              <Button
                variant="danger"
                className="admin-form-btn"
                onClick={() => handleStatusChange("Declined")}
                disabled={loading || company.Status === "Declined"}
              >
                Request Decline
              </Button>
              {/* <Button variant="primary" className="admin-form-btn">
                Third Button
              </Button> */}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MoreInformation;
