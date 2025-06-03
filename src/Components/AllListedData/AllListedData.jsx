import React, { useEffect, useState } from "react";
import "./AllListedData.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import * as XLSX from "xlsx";
import Form from "react-bootstrap/Form";
import { server } from "../../App";

const AllListedData = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (description) => {
    setModalContent(description);
    setShow(true);
  };

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${server}/getCompany`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let fetchedCompanies = res.data.compnay || [];

        // Sort companies from newest to oldest using createdAt
        fetchedCompanies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCompanies(fetchedCompanies);
        setFilteredCompanies(fetchedCompanies);
      } catch (error) {
        toast.error("Failed to fetch listed data");
        console.error(error);
      }
    };

    fetchAllCompanies();
  }, []);

  useEffect(() => {
    filterByDate();
  }, [fromDate, toDate, companies]);

  const filterByDate = () => {
    if (!fromDate && !toDate) {
      setFilteredCompanies(companies);
      return;
    }

    const from = fromDate ? new Date(fromDate) : new Date("1970-01-01");
    const to = toDate ? new Date(toDate) : new Date();

    const filtered = companies.filter((company) => {
      const createdAt = new Date(company.createdAt);
      return createdAt >= from && createdAt <= to;
    });

    setFilteredCompanies(filtered);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setFilteredCompanies(companies);
  };

  const exportToExcel = () => {
    const worksheetData = filteredCompanies.map((company, index) => ({
      "S.No.": index + 1,
      "Company Name": company.name,
      "Owner Name": company.owner,
      "Channel Partner": company.channel?.name || "N/A",
      Email: company.email,
      "Phone Number": company.phone,
      "Company Mailing Address": company.address,
      City: company.city,
      State: company.state,
      "Pin Code": company.pincode,
      "Company Description": company.description,
      "Portfolio Url": company.Portfolio.url,
      "Aadhar Card Url": company.Aadhar.url,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "companies.xlsx");
  };

  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />
      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading sorting-div">
          <h1>All Documented Records</h1>
          <div className="action-btns">
            {/* Download Button */}
            <Dropdown className="dropdown-btn">
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Download List
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={exportToExcel}>Excel</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Date Filters */}
            <Button variant="primary">
              <Form.Label>From</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Button>
            <Button variant="primary">
              <Form.Label>To</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Button>

            {/* Clear Button */}
            <Button variant="secondary" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>

        <div className="companydata-headlinelist">
          <Table bordered>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Channel Partner Name</th>
                <th>Email</th>
                {/* <th>Phone Number</th> */}
                <th>Status</th>
                <th>More Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr key={company._id}>
                  <td>{index + 1}</td>
                  <td>{company.name}</td>
                  <td>{company.owner}</td>
                  <td>{company.channel?.name || "N/A"}</td>
                  <td>{company.email}</td>
                  {/* <td>{company.phone}</td> */}
                  <td>{company?.Status}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() =>
                        navigate(`/admin/information/${company._id}`)
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>{modalContent}</Modal.Body>
      </Modal>
    </div>
  );
};

export default AllListedData;
