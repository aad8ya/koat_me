import express from "express";
import cors from "cors";
import helmet from "helmet";
import { submitQuote, getQuotes } from "./controllers/quoteController.js";
import { addRoofType, getRoofTypes } from "./controllers/roofTypeController.js";
import { getDashboardSummary } from "./controllers/dashboardController.js";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // Routes
  app.post("/api/submit", submitQuote);
  app.get("/api/quotes", getQuotes);
  app.post("/api/roof-types", addRoofType);
  app.get("/api/roof-types", getRoofTypes);
  app.get("/api/dashboard-summary", getDashboardSummary);

  return app;
};
