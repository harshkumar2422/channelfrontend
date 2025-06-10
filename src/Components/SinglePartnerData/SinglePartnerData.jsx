import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import "./SinglePartnerData.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../App";

const SinglePartnerData = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (description) => {
    setModalContent(description);
    setShow(true);
  };

  const { id } = useParams();
  console.log("id", id);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${server}/getcompanybychannelid/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let fetchedCompanies = res.data.company || [];

        // Sort companies from newest to oldest using createdAt
        fetchedCompanies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCompanies(fetchedCompanies);
      } catch (error) {
        toast.error("Failed to fetch companies");
        console.error(error);
      }
    };

    fetchCompanies();
  }, [id]);

  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />
      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading">
          <h1>Data Record Log</h1>
        </div>
        <div className="companydata-headlinelist">
          <Table bordered>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                {/* <th>Approval</th> */}
                <th>More Information</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={company._id}>
                  <td>{index + 1}</td>
                  <td>{company.name}</td>
                  <td>{company.owner}</td>
                  <td>{company.email}</td>
                  <td>{company.phone}</td>
                  {/* <td className="details-btn">
                    <Button variant="outline-primary">Approved</Button>
                    <Button variant="outline-secondary">Pending</Button>
                    <Button variant="outline-danger">Decline</Button>
                  </td> */}
                  <td>
                    <Button
                      variant="outline-info"
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

export default SinglePartnerData;
