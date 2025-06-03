import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChannelPartner.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import { server } from "../../App";

const ChannelPartner = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${server}/getchannel`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("data", res);

        setPartners(res.data.chanel || []);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error("Fetch error:", error);
      }
    };

    fetchPartners();
  }, []);

  const handlefreeze = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${server}/channelfreeze/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", res);

      toast.success(res.data.message || "Channel partner frozen successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1.5 seconds delay
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to freeze channel partner"
      );
    }
  };

  const handleunfreeze = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${server}/channelunfreeze/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", res);

      toast.success(
        res.data.message || "Channel partner unfreeze successfully"
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1.5 seconds delay
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to unfreeze channel partner"
      );
    }
  };

  return (
    <div style={{ display: "flex" }} className="main-container">
      <AdminSidebar />
      <div className="admin-companyform-conatiner">
        <div className="admin-container-heading">
          <h1>Admin Monitoring Panel</h1>
        </div>
        <div className="companydata-headlinelist">
          <div className="channelPartner-dashboard">
            {partners.length === 0 ? (
              <p style={{ padding: "1rem" }}>No channel partners found.</p>
            ) : (
              partners.map((partner) => (
                <div className="channelPartner-container" key={partner._id}>
                  <h4>{partner.name}</h4>
                  <Link to={`/admin/channel-partner/${partner._id}`}>
                    View full data list
                  </Link>
                  <div className="channel-btn">
                    {partner.status === "freeze" ? (
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleunfreeze(partner._id)}
                      >
                        unfreeze
                      </Button>
                    ) : (
                      <Button
                        variant="outline-warning"
                        onClick={() => handlefreeze(partner._id)}
                      >
                        Freeze
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPartner;
