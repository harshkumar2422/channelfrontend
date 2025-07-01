// src/components/CompanyForm/CompanyForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./CompanyForm.css";
import Sidebar from "../Sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import FormCheck from "react-bootstrap/FormCheck";
import { toast } from "react-hot-toast";
import { server } from "../../App";
import { Navigate } from "react-router-dom";

const CompanyForm = () => {
  /* ─────────── main form state ─────────── */
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

  /* ─────────── qualification metrics ───── */
  const [metrics, setMetrics] = useState({
    project50: false,
    govExperience: false,
    certifications: false,
    notBlacklisted: false,
    techAlignment: false,
    dueDiligence: false,
    publicListing: false,
  });

  /* ─────────── modal state ─────────────── */
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  /* ─────────── helpers ─────────────────── */
  const resetForm = () => {
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
    setMetrics({
      project50: false,
      govExperience: false,
      certifications: false,
      notBlacklisted: false,
      techAlignment: false,
      dueDiligence: false,
      publicListing: false,
    });
    setAgree(false);
  };

  const postToBackend = async () => {
    const toastId = toast.loading("Submitting company…");
    try {
      const token = localStorage.getItem("token");
      const payload = new FormData();

      /* text fields */
      payload.append("name", formData.company);
      payload.append("owner", formData.owner);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pincode", formData.pin);
      payload.append("description", formData.description);

      /* file */
      if (portfolio) payload.append("portfolio", portfolio);

      /* qualification metrics (as JSON string) */
      payload.append("qualificationMetrics", JSON.stringify(metrics));

      await axios.post(`${server}/registercompany`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Company submitted successfully!", { id: toastId });
      setShowConfirm(false);
      resetForm();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to submit company. Please log in again.", {
        id: toastId,
      });
      Navigate("/");
    }
  };

  /* ─────────── event handlers ──────────── */
  const handlePreSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };
  const handleFinalSubmit = () => {
    if (!agree) return toast.error("Please tick the confirmation box first.");
    postToBackend();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetricToggle = (key) =>
    setMetrics((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ─────────── JSX ─────────────────────── */
  return (
    <div style={{ display: "flex" }} className="main-container">
      <Sidebar />

      {/* ───────────── FORM ───────────── */}
      <div className="companyform-conatiner">
        <div className="container-heading">
          <h1>Business Identity Registration</h1>
        </div>

        <div className="company-form">
          <Form onSubmit={handlePreSubmit}>
            {/* ========== SECTION A/B ========== */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCompany">
                <Form.Label>Full Legal Name of Nominee Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridCompany">
                <Form.Label>CIN / Company Registration No *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="CIN No"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Year of Incorporation *</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Year of Incorporation"
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCompany">
                <Form.Label>No. of Employees (Permanent) *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCompany">
                <Form.Label>Primary Sector *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="CIN No"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Annual Turnover (Last FY) *</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Year of Incorporation"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
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
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridAddress">
                <Form.Label>Head Office Address *</Form.Label>
                <Form.Control
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="1234 Main Street"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Countries of Operation (if any)</Form.Label>
                <Form.Control
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="India"
                  required
                />
              </Form.Group>
            </Row>
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
            <h5 className="mt-4 mb-2"> Type of Company </h5>
            <Form.Group>
              <FormCheck id="metric-project50" label="Pvt Ltd" />
              <FormCheck id="metric-project50" label="LLP" />
              <FormCheck id="metric-project50" label="Partnership" />
              <FormCheck id="metric-project50" label="other" />
            </Form.Group>
            {/* ========== SECTION C – QUALIFICATION METRICS ========== */}
            <h5 className="mt-4 mb-2">SECTION B: QUALIFICATION METRICS</h5>
            <Form.Group>
              <FormCheck
                id="metric-project50"
                label="Company has completed ≥ ₹50 Cr single project in last 5 years"
                checked={metrics.project50}
                onChange={() => handleMetricToggle("project50")}
              />
              <FormCheck
                id="metric-govExperience"
                label="Company has worked with central/state government/PSUs"
                checked={metrics.govExperience}
                onChange={() => handleMetricToggle("govExperience")}
              />
              <FormCheck
                id="metric-certifications"
                label="Company holds ISO/CMMI/ESG/Defense certifications"
                checked={metrics.certifications}
                onChange={() => handleMetricToggle("certifications")}
              />
              <FormCheck
                id="metric-notBlacklisted"
                label="Company is not blacklisted (self‑declared)"
                checked={metrics.notBlacklisted}
                onChange={() => handleMetricToggle("notBlacklisted")}
              />
              <FormCheck
                id="metric-techAlignment"
                label="Company has tech/governance/digital infrastructure alignment"
                checked={metrics.techAlignment}
                onChange={() => handleMetricToggle("techAlignment")}
              />
              <FormCheck
                id="metric-dueDiligence"
                label="Company is willing to undergo due diligence and background checks"
                checked={metrics.dueDiligence}
                onChange={() => handleMetricToggle("dueDiligence")}
              />
              <FormCheck
                id="metric-publicListing"
                label="Company agrees to public listing of onboarding once approved"
                checked={metrics.publicListing}
                onChange={() => handleMetricToggle("publicListing")}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              Submit &amp; Send For Approval
            </Button>
          </Form>
        </div>
      </div>

      {/* ───────────── MODAL ───────────── */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Declaration &amp; Nomination</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ whiteSpace: "pre-wrap" }}>
          We, the undersigned, hereby nominate the above‑mentioned company for
          consideration in the VPVV Indo‑Pacific Strategic Infrastructure
          Program. We confirm that to the best of our knowledge, the information
          is accurate and the nominee is a serious, strategic‑fit candidate
          willing to comply with national secrecy protocols and onboarding
          conditions as issued from time to time.
          <hr />
          <FormCheck
            id="confirmCheck"
            type="checkbox"
            label="I have read the statement above and agree."
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFinalSubmit}
            disabled={!agree}
          >
            Confirm &amp; Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyForm;
