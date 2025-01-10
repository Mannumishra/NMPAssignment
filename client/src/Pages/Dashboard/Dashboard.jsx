import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const userid = sessionStorage.getItem("userid")
  const [users, setUsers] = useState({});

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-user-by-userid/` + userid,
          {
            withCredentials: true,
          }
        );
        console.log(response)
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">{sessionStorage.getItem("role")} Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{1}</td>
            <td>{users.firstName}</td>
            <td>{users.lastName}</td>
            <td>{users.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
