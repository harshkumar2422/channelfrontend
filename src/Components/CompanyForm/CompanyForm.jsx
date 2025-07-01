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
import Table from "react-bootstrap/Table";
import { toast } from "react-hot-toast";
import { server } from "../../App";
import { useNavigate } from "react-router-dom";

const CompanyForm = () => {
  /* ───────── STATE ───────── */
  const [formData, setFormData] = useState({
    company: "",
    owner: "",
    email: "",
    phone: "",

    // HEAD‑OFFICE
    headAddress: "",
    headCity: "",
    headState: "",
    headPin: "",

    // MAILING
    mailAddress: "",
    mailCity: "",
    mailState: "",
    mailPin: "",

    description: "",
    cin: "",
    yearofinc: "",
    typeOfComp: "",
    numofemploye: "",
    primarysector: "",
    annualturnover: "",
    countryofoperation: "",
  });

  const navigate = useNavigate();

  // uploads
  const [portfolio, setPortfolio] = useState(null);
  const [inc, setInc] = useState(null);
  const [gstandpan, setGstandpan] = useState(null);
  const [letter, setLetter] = useState(null);

  // qualification metrics
  const [metrics, setMetrics] = useState({
    project50: false,
    govExperience: false,
    certifications: false,
    notBlacklisted: false,
    techAlignment: false,
    dueDiligence: false,
    publicListing: false,
  });

  // modal & confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  // same‑address toggle
  const [sameAsHead, setSameAsHead] = useState(false);

  /* ───────── HELPERS ───────── */

  const resetForm = () => {
    setFormData({
      company: "",
      owner: "",
      email: "",
      phone: "",
      headAddress: "",
      headCity: "",
      headState: "",
      headPin: "",
      mailAddress: "",
      mailCity: "",
      mailState: "",
      mailPin: "",
      description: "",
      cin: "",
      yearofinc: "",
      typeOfComp: "",
      numofemploye: "",
      primarysector: "",
      annualturnover: "",
      countryofoperation: "",
    });
    setPortfolio(null);
    setInc(null);
    setLetter(null);
    setGstandpan(null);
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
    setSameAsHead(false);
  };

  const postToBackend = async () => {
    const toastId = toast.loading("Submitting company…");
    try {
      const token = localStorage.getItem("token");
      const payload = new FormData();

      /* ── BASIC DETAILS ── */
      payload.append("name", formData.company);
      payload.append("owner", formData.owner);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);

      /* ── HEAD‑OFFICE ── */
      payload.append("headofficeaddress", formData.headAddress);
      payload.append("headofficecity", formData.headCity);
      payload.append("headofficestate", formData.headState);
      payload.append("headofficepin", formData.headPin);

      /* ── MAILING ── */
      payload.append("address", formData.mailAddress);
      payload.append("city", formData.mailCity);
      payload.append("state", formData.mailState);
      payload.append("pincode", formData.mailPin);

      /* ── OTHER FIELDS ── */
      payload.append("description", formData.description);
      payload.append("cin", formData.cin);
      payload.append("year", formData.yearofinc);
      payload.append("typeofcompany", formData.typeOfComp);
      payload.append("noofemp", formData.numofemploye);
      payload.append("primarysector", formData.primarysector);
      payload.append("anualturnover", formData.annualturnover);
      payload.append("countryofoperation", formData.countryofoperation);
      payload.append("morethan50", metrics.project50);
      payload.append("companyworkwithcentral", metrics.govExperience);
      payload.append("companyholds", metrics.certifications);
      payload.append("companyisnotbacklisted", metrics.notBlacklisted);
      payload.append("companyhastech", metrics.techAlignment);
      payload.append("companyapproveduedelligence", metrics.dueDiligence);
      payload.append("companyagresstopubliclisting", metrics.publicListing);
      payload.append("qualificationMetrics", JSON.stringify(metrics));

      /* ── FILES ── */
      if (portfolio) payload.append("portfolio", portfolio);
      if (inc) payload.append("inc", inc);
      if (gstandpan) payload.append("gstandpan", gstandpan);
      if (letter) payload.append("letter", letter);

      /* ── REQUEST ── */
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
    }
  };

  /* ───────── HANDLERS ───────── */

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    if (!agree) return toast.error("Please tick the confirmation box first.");
    postToBackend();
  };

  /** Universal change handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // keep mailing address synced if checkbox is ON
      if (sameAsHead) {
        updated.mailAddress = updated.headAddress;
        updated.mailCity = updated.headCity;
        updated.mailState = updated.headState;
        updated.mailPin = updated.headPin;
      }
      return updated;
    });
  };

  /** Toggle for “Same as head office” */
  const handleSameAsHeadToggle = (checked) => {
    setSameAsHead(checked);
    setFormData((prev) => ({
      ...prev,
      mailAddress: checked ? prev.headAddress : "",
      mailCity: checked ? prev.headCity : "",
      mailState: checked ? prev.headState : "",
      mailPin: checked ? prev.headPin : "",
    }));
  };

  /** Metric toggle */
  const handleMetricToggle = (key) =>
    setMetrics((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ───────── RENDER ───────── */

  return (
    <div style={{ display: "flex" }} className="main-container">
      <Sidebar />

      <div className="companyform-conatiner">
        <div className="container-heading">
          <h1>Nomination Form</h1>
        </div>

        <div className="company-form">
          <Form onSubmit={handlePreSubmit}>
            {/* ── BASIC COMPANY INFO ───────────────────────────── */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Full Legal Name of Nominee Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company full legal name"
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>CIN / Company Registration No *</Form.Label>
                <Form.Control
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="Enter company CIN no."
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Year of Incorporation *</Form.Label>
                <Form.Control
                  type="number"
                  name="yearofinc"
                  value={formData.yearofinc}
                  onChange={handleChange}
                  placeholder="Enter year of incorporation"
                  required
                />
              </Form.Group>
            </Row>

            {/* ── TYPE & OPERATIONS ───────────────────────────── */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Type of Company *</Form.Label>
                <Form.Select
                  name="typeOfComp"
                  value={formData.typeOfComp}
                  onChange={handleChange}
                >
                  <option>Select the type of your company</option>
                  <option value="Pvt Ltd">Pvt Ltd</option>
                  <option value="Ltd">Public Ltd</option>
                  <option value="LLP">LLP</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Countries of Operation (if any)</Form.Label>
                <Form.Control
                  type="text"
                  name="countryofoperation"
                  value={formData.countryofoperation}
                  onChange={handleChange}
                  placeholder="Enter countries of operation "
                />
              </Form.Group>
            </Row>

            {/* ── EMPLOYEES, SECTOR, TURNOVER ─────────────────── */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>No. of Employees (Permanent) *</Form.Label>
                <Form.Control
                  type="number"
                  name="numofemploye"
                  placeholder="Enter number of employee"
                  value={formData.numofemploye}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Primary Sector *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter company sector"
                  name="primarysector"
                  value={formData.primarysector}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Annual Turnover (Last FY) *</Form.Label>
                <Form.Control
                  type="number"
                  name="annualturnover"
                  placeholder="Enter company annual turnover"
                  value={formData.annualturnover}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>

            {/* ── CONTACT ─────────────────────────────────────── */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Director / Proprietor *</Form.Label>
                <Form.Control
                  type="text"
                  name="owner"
                  placeholder="Enter director / proprietor name"
                  value={formData.owner}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Phone Number (For Future Communication)*
                </Form.Label>
                <Form.Control
                  type="number"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>

            {/* ── HEAD‑OFFICE ADDRESS ─────────────────────────── */}
            <h5 className="mt-4 mb-2">
              <b>Head Office Address</b>
            </h5>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Street Address *</Form.Label>
                <Form.Control
                  name="headAddress"
                  placeholder="Enter head office address"
                  value={formData.headAddress}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>City *</Form.Label>
                <Form.Control
                  name="headCity"
                  placeholder="Enter city"
                  value={formData.headCity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>State *</Form.Label>
                <Form.Control
                  name="headState"
                  placeholder="Enter state"
                  value={formData.headState}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Pin Code *</Form.Label>
                <Form.Control
                  type="number"
                  name="headPin"
                  placeholder="Enter pin code"
                  value={formData.headPin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>

            {/* ── SAME‑AS CHECKBOX ────────────────────────────── */}
            <FormCheck
              className="my-3"
              type="checkbox"
              id="sameAsHead"
              label="Same as Head Office Address"
              checked={sameAsHead}
              onChange={(e) => handleSameAsHeadToggle(e.target.checked)}
            />

            {/* ── MAILING ADDRESS ─────────────────────────────── */}
            <h5 className="mb-2">
              <b>Company Mailing Address</b>
            </h5>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Street Address *</Form.Label>
                <Form.Control
                  name="mailAddress"
                  placeholder="Enter mailing address"
                  value={formData.mailAddress}
                  onChange={handleChange}
                  disabled={sameAsHead}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>City *</Form.Label>
                <Form.Control
                  name="mailCity"
                  placeholder="Enter city"
                  value={formData.mailCity}
                  onChange={handleChange}
                  disabled={sameAsHead}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>State *</Form.Label>
                <Form.Control
                  name="mailState"
                  placeholder="Enter state"
                  value={formData.mailState}
                  onChange={handleChange}
                  disabled={sameAsHead}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Pin Code *</Form.Label>
                <Form.Control
                  type="number"
                  name="mailPin"
                  placeholder="Enter pin code"
                  value={formData.mailPin}
                  onChange={handleChange}
                  disabled={sameAsHead}
                  required
                />
              </Form.Group>
            </Row>

            {/* ── DESCRIPTION ────────────────────────────────── */}
            <Form.Group className="mb-3">
              <Form.Label>Company Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter company description..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* ── QUALIFICATION METRICS ──────────────────────── */}
            <h4 className="mt-4 mb-2">
              <b>QUALIFICATION METRICS</b>
            </h4>
            <Form.Group>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company has completed ≥ ₹50 Cr single project in last 5 years"
                        checked={metrics.project50}
                        onChange={() => handleMetricToggle("project50")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company has worked with central/state government/PSUs"
                        checked={metrics.govExperience}
                        onChange={() => handleMetricToggle("govExperience")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company holds ISO/CMMI/ESG/Defense certifications"
                        checked={metrics.certifications}
                        onChange={() => handleMetricToggle("certifications")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company is not blacklisted (self‑declared)"
                        checked={metrics.notBlacklisted}
                        onChange={() => handleMetricToggle("notBlacklisted")}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company has tech/governance/digital infrastructure alignment"
                        checked={metrics.techAlignment}
                        onChange={() => handleMetricToggle("techAlignment")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company is willing to undergo due diligence"
                        checked={metrics.dueDiligence}
                        onChange={() => handleMetricToggle("dueDiligence")}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Check
                        label="Company agrees to public listing of onboarding once approved"
                        checked={metrics.publicListing}
                        onChange={() => handleMetricToggle("publicListing")}
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Form.Group>

            {/* ── FILE UPLOADS ───────────────────────────────── */}
            <Form.Group controlId="filePortfolio" className="mb-3">
              <Form.Label>Upload Company Portfolio *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPortfolio(e.target.files[0])}
                required
              />
            </Form.Group>
            <Form.Group controlId="fileInc" className="mb-3">
              <Form.Label>Upload Certificate of Incorporation *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setInc(e.target.files[0])}
                required
              />
            </Form.Group>
            <Form.Group controlId="fileGstPan" className="mb-3">
              <Form.Label>Upload GST + PAN *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setGstandpan(e.target.files[0])}
                required
              />
            </Form.Group>
            <Form.Group controlId="fileLetter" className="mb-3">
              <Form.Label>Upload Letter of Intent *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setLetter(e.target.files[0])}
                required
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

      {/* ───────── CONFIRMATION MODAL ───────── */}
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
