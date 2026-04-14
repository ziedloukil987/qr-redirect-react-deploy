import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQrInfo, submitQrForm } from "../api";

const formationOptions = [
  "BTS MCO",
  "BTS NDRC",
  "BTS CG",
  "BTS GPME",
  "BTS CIEL",
  "BTS SIO",
  "BTS Métiers de l’Audiovisuel",
  "BTS SP3S",
  "Administrateur Système DevOps",
  "Concepteur Designer UI",
  "MBA Stratégie Digitale",
  "MBA Business Management"
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  preferredFormation: ""
};

export default function FormPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrInfo, setQrInfo] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    async function fetchQrInfo() {
      setLoading(true);
      setServerError("");

      try {
        const result = await getQrInfo(code);

        if (!result.ok || !result.data.success) {
          navigate("/invalid-code");
          return;
        }

        setQrInfo(result.data.data);
      } catch (error) {
        console.error(error);
        setServerError("Unable to load this form.");
      } finally {
        setLoading(false);
      }
    }

    fetchQrInfo();
  }, [code, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError("");

    try {
      const result = await submitQrForm(code, formData);

      if (!result.ok) {
        if (result.data?.errors) {
          setErrors(result.data.errors);
        } else {
          setServerError(result.data?.message || "Submission failed.");
        }
        return;
      }

      const redirectUrl = result.data.redirectUrl;
      navigate(`/thank-you?next=${encodeURIComponent(redirectUrl)}`);
    } catch (error) {
      console.error(error);
      setServerError("Unexpected error while submitting the form.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (serverError && !qrInfo) {
    return (
      <div className="page">
        <div className="card">
          <h1>Error</h1>
          <p>{serverError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Registration Form</h1>
        <p className="subtitle">
          Please fill in your information before continuing.
        </p>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && <small className="error">{errors.firstName}</small>}
          </div>

          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && <small className="error">{errors.lastName}</small>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="field">
            <label htmlFor="phoneNumber">Phone number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && (
              <small className="error">{errors.phoneNumber}</small>
            )}
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}