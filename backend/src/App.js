import express from "express";
import cors from "cors";
import helmet from "helmet";
import { submitQuote } from "./controllers/quoteController.js";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // Routes
  app.post("/api/submit", submitQuote);

  return app;
};
