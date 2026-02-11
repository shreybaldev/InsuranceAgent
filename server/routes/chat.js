import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getInsuranceAdvice } from "../services/gemini.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const HISTORY_FILE = join(__dirname, "../data/history.json");

async function getHistory() {
  try {
    const data = await readFile(HISTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveHistory(history) {
  await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

router.post("/chat", upload.single("pdf"), async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    let pdfContent = null;

    // Extract text from PDF if uploaded
    if (req.file) {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        pdfContent = pdfData.text;
        console.log("PDF parsed, extracted", pdfContent.length, "characters");
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return res.status(400).json({ error: "Failed to parse PDF file" });
      }
    }

    const answer = await getInsuranceAdvice(question, pdfContent);

    const entry = {
      id: Date.now().toString(),
      question,
      answer,
      hasPdf: !!req.file,
      pdfName: req.file?.originalname || null,
      timestamp: new Date().toISOString(),
    };

    const history = await getHistory();
    history.push(entry);
    await saveHistory(history);

    res.json(entry);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await getHistory();
    res.json(history);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to load history" });
  }
});

export default router;
