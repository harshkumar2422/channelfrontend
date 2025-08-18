import React, { useEffect, useState } from "react";
import "./MoreInformation.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../App";

const MoreInformation = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aadharModal, setAadharModal] = useState(false);

  const openDoc = (url) => window.open(url, "_blank");

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${server}/getcompany/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(data.company);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch company details");
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      console.log("ew",newStatus);
      
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${server}/approvalcompany/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany((prev) => ({ ...prev, Status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  if (!company) return <p style={{ padding: "2rem" }}>Loading…</p>;

  const metrics = {
    "Company has completed ≥ ₹50 Cr single project in last 5 years":
      company.morethan50,
    "Company has worked with central/state government/PSUs":
      company.companyworkwithcentral,
    "Company holds ISO/CMMI/ESG/Defense certifications": company.companyholds,
    "Company is not blacklisted (self-declared)":
      company.companyisnotbacklisted,
    "Company has tech/governance/digital infrastructure alignment":
      company.companyhastech,
    "Company is willing to undergo due diligence":
      company.companyapproveduedelligence,
    "Company agrees to public listing of onboarding once approved":
      company.companyagresstopubliclisting,
  };

  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />

      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading">
          <h1>Company – Detailed Overview</h1>
        </div>

        <div className="company-form">
          <Form className="admin-form">
            {/* BASIC DETAILS */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Full Legal Name</Form.Label>
                <p>{company.name}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>CIN</Form.Label>
                <p>{company.cin}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Year of Incorporation</Form.Label>
                <p>{company.year}</p>
              </Form.Group>
            </Row>

            {/* TYPE & OPERATIONS */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Type of Company</Form.Label>
                <p>{company.typeofcompany}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Countries of Operation</Form.Label>
                <p>{company.countryofoperation}</p>
              </Form.Group>
            </Row>

            {/* EMPLOYEES, SECTOR, TURNOVER */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>No. of Employees</Form.Label>
                <p>{company.noofemp}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Primary Sector</Form.Label>
                <p>{company.primarysector}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Annual Turnover</Form.Label>
                <p>{company.anualturnover}</p>
              </Form.Group>
            </Row>

            {/* CONTACT */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Director / Proprietor</Form.Label>
                <p>{company.owner}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <p>{company.email}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Phone</Form.Label>
                <p>{company.phone}</p>
              </Form.Group>
            </Row>

            {/* HEAD-OFFICE ADDRESS */}
            <h5 className="mt-3">Head Office Address</h5>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Street</Form.Label>
                <p>{company.headofficeaddress}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>City</Form.Label>
                <p>{company.headofficecity}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>State</Form.Label>
                <p>{company.headofficestate}</p>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Pin Code</Form.Label>
                <p>{company.headofficepin}</p>
              </Form.Group>
            </Row>

            {/* MAILING ADDRESS */}
            <h5 className="mt-3">Mailing Address</h5>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Street</Form.Label>
                <p>{company.address}</p>
              </Form.Group>
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
            </Row>

            {/* DESCRIPTION */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <p>{company.description}</p>
            </Form.Group>

            {/* QUALIFICATION METRICS */}
            <h5 className="mt-4 mb-2"><b>Qualification Metrics</b></h5>
            <Table striped bordered size="sm">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="text-center">Meets?</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(metrics).map(([label, val]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className="text-center">{val ? "✔️" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* DOCUMENT BUTTONS */}
            <div className="admin-information-btn-continer">
              <Button variant="primary" onClick={() => openDoc(company.Portfolio?.url)}>View Portfolio</Button>
              <Button variant="primary" onClick={() => openDoc(company.Inc?.url)}>Certificate of Inc.</Button>
              <Button variant="primary" onClick={() => openDoc(company.GstandPan?.url)}>GST + PAN</Button>
              <Button variant="primary" onClick={() => openDoc(company.letterofintent?.url)}>Letter of Intent</Button>
              <Button variant="primary" onClick={() => setAadharModal(true)}>View Aadhar Cards</Button>
            </div>

            {/* STATUS BUTTONS */}
            <div className="admin-information-btn-continer mt-3">
              <Button
                variant="warning"
                disabled={loading || company.Status === "Initial Approved"}
                onClick={() => updateStatus("Initial Approved")}
              >
                Initial Approval
              </Button>
              <Button
                variant="success"
                disabled={loading || company.Status === "Due Diligence Approved"}
                onClick={() => updateStatus("Due Diligence Approved")}
              >
                Due Diligence Approved
              </Button>
              <Button
                variant="danger"
                disabled={loading || company.Status === "Declined"}
                onClick={() => updateStatus("Declined")}
              >
                Decline
              </Button>
            </div>

            <Form.Group className="mt-3">
              <Form.Label>Current Status</Form.Label>
              <p>{company.Status}</p>
            </Form.Group>

            <Form.Group>
              <Form.Label>Record Created</Form.Label>
              <p>{new Date(company.createdAt).toLocaleString()}</p>
            </Form.Group>
          </Form>
        </div>
      </div>

      {/* AADHAR MODAL */}
      <Modal show={aadharModal} onHide={() => setAadharModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Aadhar Cards</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {company.Aadhar?.length ? (
            company.Aadhar.map((doc, i) => (
              <Button
                key={i}
                variant="outline-primary"
                className="mb-2"
                onClick={() => openDoc(doc.url)}
              >
                {`Aadhar ${i + 1}`}
              </Button>
            ))
          ) : (
            <p>No Aadhar cards uploaded.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MoreInformation;
