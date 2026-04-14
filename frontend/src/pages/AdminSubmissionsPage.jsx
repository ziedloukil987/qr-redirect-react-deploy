import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminSubmissions } from "../api";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setServerError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const result = await getAdminSubmissions(token);

        if (!result.ok || !result.data.success) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }

        setSubmissions(result.data.data || []);
      } catch (error) {
        console.error(error);
        setServerError("Unable to load submissions.");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header admin-header-row">
          <div>
            <h1>Admin - Submissions</h1>
            <p>All submitted entries are shown below.</p>
          </div>

          <button className="btn admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {loading && <div className="admin-card">Loading submissions...</div>}

        {!loading && serverError && (
          <div className="admin-card admin-error">{serverError}</div>
        )}

        {!loading && !serverError && submissions.length === 0 && (
          <div className="admin-card">No submissions found.</div>
        )}

        {!loading && !serverError && submissions.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>QR code</th>
                  <th>QR label</th>
                  <th>Redirect URL</th>
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item._id}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.qrCode}</td>
                    <td>{item.qrLabel}</td>
                    <td>
                      <a href={item.redirectUrl} target="_blank" rel="noreferrer">
                        {item.redirectUrl}
                      </a>
                    </td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}