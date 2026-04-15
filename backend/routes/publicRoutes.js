const express = require("express");
const router = express.Router();

const QrRoute = require("../models/QrRoute");
const Submission = require("../models/Submission");
const adminAuth = require("../middleware/adminAuth");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+0-9()\-.\s]{6,30}$/.test(phone);
}

router.get("/qr/:code", async (req, res) => {
  try {
    const code = String(req.params.code || "").trim().toLowerCase();
    const qrRoute = await QrRoute.findOne({ code, isActive: true }).lean();

    if (!qrRoute) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code"
      });
    }

    return res.json({
      success: true,
      data: {
        code: qrRoute.code,
        label: qrRoute.label
      }
    });
  } catch (error) {
    console.error("GET /qr/:code error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.post("/qr/:code/submit", async (req, res) => {
  try {
    const code = String(req.params.code || "").trim().toLowerCase();
    const qrRoute = await QrRoute.findOne({ code, isActive: true }).lean();

    if (!qrRoute) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code"
      });
    }

    const firstName = String(req.body.firstName || "").trim();
    const lastName = String(req.body.lastName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phoneNumber = String(req.body.phoneNumber || "").trim();

    const errors = {};

    if (!firstName) errors.firstName = "First name is required.";
    if (!lastName) errors.lastName = "Last name is required.";
    if (!email) errors.email = "Email is required.";
    else if (!isValidEmail(email)) errors.email = "Invalid email.";

    if (!phoneNumber) errors.phoneNumber = "Phone number is required.";
    else if (!isValidPhone(phoneNumber)) errors.phoneNumber = "Invalid phone number.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    await Submission.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      qrCode: qrRoute.code,
      qrLabel: qrRoute.label,
      redirectUrl: qrRoute.redirectUrl,
      ipAddress: req.ip || "",
      userAgent: req.get("user-agent") || ""
    });

    return res.json({
      success: true,
      message: "Submission saved",
      redirectUrl: qrRoute.redirectUrl
    });
  } catch (error) {
    console.error("POST /qr/:code/submit error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Admin login
router.post("/admin/login", async (req, res) => {
  try {
    const password = String(req.body.password || "").trim();

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required."
      });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid password."
      });
    }

    return res.json({
      success: true,
      token: process.env.ADMIN_TOKEN
    });
  } catch (error) {
    console.error("POST /admin/login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Admin: get all submissions
router.get("/admin/submissions", adminAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error("GET /admin/submissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Admin: export submissions as CSV
router.get("/admin/submissions/export", adminAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .sort({ createdAt: -1 })
      .lean();

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "QR Code",
      "QR Label",
      "Redirect URL",
      "IP Address",
      "User Agent",
      "Created At"
    ];

    const rows = submissions.map((item) => [
      item.firstName || "",
      item.lastName || "",
      item.email || "",
      item.phoneNumber || "",
      item.qrCode || "",
      item.qrLabel || "",
      item.redirectUrl || "",
      item.ipAddress || "",
      item.userAgent || "",
      item.createdAt ? new Date(item.createdAt).toLocaleString("fr-FR") : ""
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(","))
    ].join("\n");

    // BOM helps Excel open UTF-8 CSV correctly
    const csvWithBom = "\uFEFF" + csvContent;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="submissions.csv"');

    return res.status(200).send(csvWithBom);
  } catch (error) {
    console.error("GET /admin/submissions/export error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
