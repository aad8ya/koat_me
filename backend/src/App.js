import express from "express";
import cors from "cors";
import helmet from "helmet";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  return app;
};
