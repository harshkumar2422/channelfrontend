import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { toast } from "react-hot-toast";
import { server } from "../../App";

const Addexistingcompany = () => {
  const [formData, setFormData] = useState({
    company: "",
    companyId: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    date: "",
    status: "",
  });

  const [portfolio, setPortfolio] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [companies, setCompanies] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanySelect = (e) => {
    const selectedCompanyId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      companyId: selectedCompanyId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Submitting company...");

    try {
        const token = localStorage.getItem("token");
        
      const payload = new FormData();

      payload.append("chanel", formData.companyId);
      payload.append("name", formData.company);
      payload.append("owner", formData.owner);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pincode", formData.pin);
      payload.append("date", formData.date);
      payload.append("Status", formData.status);

      if (portfolio) payload.append("portfolio", portfolio);
      if (aadhar) payload.append("aadhar", aadhar);

      const res = await axios.post(`${server}/alreadyregistered`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message, { id: toastId });

      setFormData({
        companyId: "",
        company: "",
        owner: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        date: "",
        status: "",
      });
      setPortfolio(null);
      setAadhar(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response.data.message, {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/getchannel`);
        setCompanies(response.data.chanel);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />
      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading">
          <h1> Add Company </h1>
        </div>
        <div className="company-form">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group controlId="formGridCompany">
                <Form.Label>Select Channel Partner (If Applicable)</Form.Label>
                <Form.Select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleCompanySelect}
                >
                  <option value="">-- Select Channel Partner --</option>
                  {companies.map((company) => (
                    <option
                      key={company._id || company.name}
                      value={company._id}
                    >
                      {company.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCompanyName">
                <Form.Label>Company *</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridOwner">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  placeholder="Enter Owner's Name"
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
                  placeholder="Enter Email"
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
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress">
              <Form.Label>Company Address *</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Company Address"
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
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State *</Form.Label>
                <Form.Control
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="New Delhi"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Pin Code *</Form.Label>
                <Form.Control
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="000000"
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} controlId="formGridDate">
                <Form.Label>Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridstatus">
                <Form.Label>Status *</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option value="Initial Approved">Initial Approved</option>
                  <option value="Due Diligence Approved">
                    Due Diligence Approved
                  </option>
                  <option value="Declined">Declined</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Form.Group controlId="formFilePortfolio" className="mb-3">
              <Form.Label>Upload Aadhar *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setAadhar(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="formFilePortfolio" className="mb-3">
              <Form.Label>Upload Portfolio *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPortfolio(e.target.files[0])}
              />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Addexistingcompany;
