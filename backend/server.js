require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const publicRoutes = require("./routes/publicRoutes");
const QrRoute = require("./models/QrRoute");

const app = express();

connectDB();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});

app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QR Redirect API is running"
  });
});

app.use("/api", publicRoutes);

async function seedQrRoutes() {
  const count = await QrRoute.countDocuments();

  if (count === 0) {
    await QrRoute.insertMany([
      {
        code: "Administrateur-Système-DevOps",
        label: "Administrateur Système DevOps",
        redirectUrl: "https://qr.link/odNu7f"
      },
      {
        code: "Concepteur-Designer-UI",
        label: "Concepteur Designer UI",
        redirectUrl: "https://qr.codes/ldMa4q"
      },
      {
        code: "Responsable-Etablissment-Touristique",
        label: "Responsable d'Etablissment Touristique",
        redirectUrl: "https://qr.codes/ldMa4q"
      },
      {
        code: "Responsable-Etablissment-Marchand",
        label: "Responsable d'Etablissment Marchand",
        redirectUrl: "https://qr.codes/ldMa4q"
      },
      {
        code: "MBA-Stratégie-Digitale",
        label: "MBA Stratégie Digitale",
        redirectUrl: "https://qr.codes/ldMa4q"
      },
      {
        code: "MBA-Business-Management",
        label: "MBA Business Management",
        redirectUrl: "https://qr.codes/ldMa4q"
      },
      {
        code: "BTS-MCO",
        label: "Management Commercial Opérationnel",
        redirectUrl: "https://qrlnk.pro/preview/c53308b0-b799-4759-aefa-7ec66cae9e02"
      },
      {
        code: "BTS-NDRC",
        label: "Négociation et Digitalisation de la Relation Client",
        redirectUrl: "https://qrlnk.pro/preview/8fee46c5-58f8-4c09-8ec2-f0e5be64edcf"
      },
      {
        code: "BTS-GPME",
        label: "Gestion de PME",
        redirectUrl: "https://qrlnk.pro/preview/5c0f5ddc-5602-4aa1-8cf3-3aa4c1521fa5"
      },
      {
        code: "BTS-CIEL",
        label: "Cybersecurity,Informatique et Réseaux,Electronique",
        redirectUrl: "https://qr.codes/gxCLru"
      },
      {
        code: "BTS-SIO",
        label: "Services Informatiques aux Organisations",
        redirectUrl: "https://qr.codes/uEWqwB"
      },
      {
        code: "BTS-Métiers-de-l’Audiovisuel",
        label: "Métiers de l’Audiovisuel",
        redirectUrl: "https://qr.codes/ldMa4q"
      },
      {
        code: "BTS-SP3S",
        label: "Services et Prestations des Secteurs Sanitaire et Social",
        redirectUrl: "https://qr.link/BQum0b"
      },
    ]);

    console.log("Default QR routes seeded");
  }
}

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await seedQrRoutes();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
})();
