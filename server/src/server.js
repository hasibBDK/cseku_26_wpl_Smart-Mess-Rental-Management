import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import tuitionRoutes from "./routes/tuitionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function corsOrigin(origin, callback) {
  const isLocalDevelopment =
    process.env.NODE_ENV !== "production" &&
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

  if (!origin || allowedOrigins.includes(origin) || isLocalDevelopment) {
    return callback(null, true);
  }
  callback(new Error(`Origin ${origin} is not allowed by CORS.`));
}

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tuitions", tuitionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/homes", homeRoutes);
app.use("/api/marketplace", marketplaceRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }
  res.status(500).json({ message: "Something went wrong on the server." });
});

connectDatabase()
  .then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}`)))
  .catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  });
