import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", chatRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from React build
const clientBuildPath = join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Handle React routing - serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
