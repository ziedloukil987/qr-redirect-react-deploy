import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import InvalidCodePage from "./pages/InvalidCodePage";
import ThankYouPage from "./pages/ThankYouPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSubmissionsPage from "./pages/AdminSubmissionsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/r/:code" element={<FormPage />} />
      <Route path="/invalid-code" element={<InvalidCodePage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/submissions" element={<AdminSubmissionsPage />} />
    </Routes>
  );
}