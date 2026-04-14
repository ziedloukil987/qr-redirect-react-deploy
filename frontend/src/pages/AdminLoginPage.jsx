import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSubmitting(true);

    try {
      const result = await adminLogin(password);

      if (!result.ok || !result.data.success) {
        setServerError(result.data?.message || "Login failed.");
        return;
      }

      localStorage.setItem("adminToken", result.data.token);
      navigate("/admin/submissions");
    } catch (error) {
      console.error(error);
      setServerError("Unexpected error during login.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Admin Login</h1>
        <p className="subtitle">Enter the admin password to continue.</p>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}