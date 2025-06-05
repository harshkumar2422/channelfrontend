import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CompanyForm.css";
import Sidebar from "../Sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-hot-toast";
import { server } from "../../App";
import { Navigate } from "react-router-dom";

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    company: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    description: "",
  });

  const [portfolio, setPortfolio] = useState(null);
  // const [aadhar, setAadhar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Submitting company...");

    try {
      const token = localStorage.getItem("token");
      const payload = new FormData();

      // Append text fields
      payload.append("name", formData.company);
      payload.append("owner", formData.owner);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pincode", formData.pin);
      payload.append("description", formData.description);

      // Append files
      if (portfolio) payload.append("portfolio", portfolio);
      // if (aadhar) payload.append("aadhar", aadhar);

      const res = await axios.post(`${server}/registercompany`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Company submitted successfully!", { id: toastId });

      setFormData({
        company: "",
        owner: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        description: "",
      });
      setPortfolio(null);
      // setAadhar(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit company. Please Login again.", {
        id: toastId,
      });
      Navigate("/");
    }
  };

  useEffect(() => {
    // Placeholder for data fetching if needed later
  }, []);

  return (
    <div style={{ display: "flex" }} className="main-container">
      <Sidebar />
      <div className="companyform-conatiner">
        <div className="container-heading">
          <h1>Business Identity Registration</h1>
        </div>
        <div className="company-form">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCompany">
                <Form.Label>Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridOwner">
                <Form.Label>Director / Proprietor *</Form.Label>
                <Form.Control
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  placeholder="Enter director/proprietor name"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPhone">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91"
                  required
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress">
              <Form.Label>Company Mailing Address *</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="1234 Main Street"
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City *</Form.Label>
                <Form.Control
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Delhi"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State *</Form.Label>
                <Form.Control
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="New Delhi"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Pin Code *</Form.Label>
                <Form.Control
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="000000"
                  required
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridDescription">
              <Form.Label>Company Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please write some description about the company..."
                required
              />
            </Form.Group>

            <Form.Group controlId="formFilePortfolio" className="mb-3">
              <Form.Label>Upload Portfolio *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPortfolio(e.target.files[0])}
                required
              />
            </Form.Group>

            {/* <Form.Group controlId="formFileAadhar" className="mb-3">
              <Form.Label>Upload Aadhar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setAadhar(e.target.files[0])}
              />
            </Form.Group> */}

            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Submit & Send For Approval
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
