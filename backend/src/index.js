import dotenv from "dotenv";
import { createApp } from "./App.js";

dotenv.config;

const app = createApp();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
