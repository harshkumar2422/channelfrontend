import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { server } from "../../App";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const VisitorsEntrylog = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(`${server}/getEntry`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("dataa", data.entry);

        let sortedCompanies = data.entry || [];

        // Sort by createdAt from newest to oldest
        sortedCompanies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCompanies(sortedCompanies);
        console.log("data", sortedCompanies);
      } catch (error) {
        console.error("Failed to fetch companies: Please Login Again");
      }
    };

    fetchCompanies();
  }, []);
  const viewportfoliohandler = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("Portfolio not available.");
    }
  };
  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />
      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading">
          <h1> Visitors Entry Log</h1>
        </div>
        <div className="companydata-headlinelist">
          <Table bordered className="compnaydata-tabel">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Company Name</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Pin Code</th>
                <th>Reference</th>
                <th>Aadhar Card</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((comp, index) => (
                <tr key={comp._id}>
                  <td>{index + 1}</td>
                  <td>{comp.companyname}</td>
                  <td>{comp.Name}</td>
                  <td>{comp.Email}</td>
                  <td>{comp.phone}</td>
                  <td>{comp.address}</td>
                  <td>{comp.city}</td>
                  <td>{comp.state}</td>
                  <td>{comp.pincode}</td>
                  <td>{comp.reference}</td>

                  <td>
                    {comp.Aadhar?.url ? (
                      <Button
                        variant="info"
                        onClick={() => viewportfoliohandler(comp.Aadhar.url)}
                      >
                        View
                      </Button>
                    ) : (
                      "N/A"
                    )}
                  </td> 
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default VisitorsEntrylog;
