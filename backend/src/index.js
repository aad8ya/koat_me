import dotenv from "dotenv";
import { createApp } from "./App.js";

dotenv.config;

const app = createApp();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
