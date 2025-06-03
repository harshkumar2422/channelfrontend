import React, { useState } from "react";
import axios from "axios";
import "./UploadAadhar.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Sidebar from "../Sidebar/Sidebar";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { server } from "../../App";

const UploadAadhar = () => {
  const [numPeople, setNumPeople] = useState(1);
  const [aadharFiles, setAadharFiles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSelectChange = (e) => {
    const newCount = parseInt(e.target.value);
    setNumPeople(newCount);
    setAadharFiles(new Array(newCount).fill(null));
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...aadharFiles];
    newFiles[index] = e.target.files[0];
    setAadharFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    aadharFiles.forEach((file, index) => {
      if (file) {
        formData.append("aadhar", file); // Backend should expect "aadharFiles" as array
      }
    });

    try {
      const response = await axios.post(
        `${server}/addAddhar/${id}`, // ✅ replace with your backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Aadhar Uploaded Successfully");
      navigate("/company-list");
    } catch (error) {
      console.error("Error uploading Aadhar files:", error);
      alert("Failed to upload. Please try again.");
    }
  };

  return (
    <>
      <div style={{ display: "flex" }} className="main-container">
        <Sidebar />
        <div className="company-aadhar-conatiner">
          <div className="container-aadhar-heading">
            <h1>Upload Aadhar Details</h1>
          </div>
          <div className="container">
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h3>Select The Number of People</h3>
                </Form.Label>
                <Form.Select value={numPeople} onChange={handleSelectChange}>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {[...Array(numPeople)].map((_, index) => (
                <div key={index}>
                  <h4 style={{ marginTop: "50px", marginBottom: "20px" }}>
                    Person {index + 1}
                  </h4>
                  <Form.Group controlId={`formFile-${index}`} className="mb-3">
                    <Form.Label>Upload Aadhar Card</Form.Label>
                    <Form.Control
                      type="file"
                      required
                      onChange={(e) => handleFileChange(e, index)}
                    />
                  </Form.Group>
                </div>
              ))}

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadAadhar;
