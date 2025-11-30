require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// optional Mongoose model (if you want to persist in DB)
let Model = null;
try {
  Model = require("../models/GeneratedUi.js");
} catch (e) {
  console.warn("GeneratedUi model not found or failed to load. DB save endpoints will still work if Model exists.", e.message);
}

// Try to safely require Google Gemini SDK (optional)
let GoogleGenerativeAI = null;
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini SDK loaded");
  } catch (e) {
    console.warn("⚠️  Could not load @google/generative-ai SDK:", e.message);
    genAI = null;
  }
} else {
  console.log("⚠️  GEMINI_API_KEY not set — using mock generation");
}

/* ---------------- Helpers ---------------- */

// Build the system/user prompt for a UI component
const generateUIPrompt = (userPrompt) => {
  return `You are an expert frontend developer specializing in creating modern, responsive UI components using Tailwind CSS.

User Request: ${userPrompt}

Requirements:
1. Generate a complete, production-ready HTML component using Tailwind CSS
2. Ensure the design is:
   - Fully responsive (mobile-first approach)
   - Accessible (proper semantic HTML, ARIA labels)
   - Modern and visually appealing
   - Uses Tailwind CSS utility classes only (no custom CSS)
3. Include proper spacing, colors from Tailwind palette, and typography
4. Add interactive elements with Tailwind hover/focus states
5. Ensure dark mode compatibility using dark: prefix where applicable

Return ONLY the HTML code (no explanations). If possible, return plain HTML string (no markdown).`;
};

// Extract plain textual content from Gemini/OpenAI style response objects
function extractTextFromResponse(resp) {
  if (!resp) return "";

  // If it's already a string
  if (typeof resp === "string") return resp;

  // Common structure for some SDKs
  if (resp.outputText) return resp.outputText;
  if (resp.text) return resp.text;

  // Newer Google GenAI "responses" shape
  if (resp?.candidates && Array.isArray(resp.candidates) && resp.candidates[0]?.content) {
    // candidates[0].content might be an array of "parts"
    const content = resp.candidates[0].content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      // join parts
      return content.map(p => (p?.text ?? "")).join("");
    }
    if (content?.text) return content.text;
  }

  // Some responses are nested
  if (resp?.outputs && Array.isArray(resp.outputs)) {
    // join textual parts
    return resp.outputs.map(o => {
      if (typeof o === "string") return o;
      if (o?.content?.[0]?.text) return o.content[0].text;
      if (o?.text) return o.text;
      return "";
    }).join("\n");
  }

  // Fallback to JSON stringify
  try {
    return JSON.stringify(resp, null, 2);
  } catch (e) {
    return String(resp);
  }
}

// Persist project to disk (best-effort)
function persistProjectToDisk(project) {
  try {
    const base = path.join(process.cwd(), "data", "projects");
    fs.mkdirSync(base, { recursive: true });
    const out = path.join(base, `${project.id}.json`);
    fs.writeFileSync(out, JSON.stringify(project, null, 2), "utf8");
    return { ok: true, path: out };
  } catch (err) {
    console.warn("Failed to persist project to disk:", err.message || err);
    return { ok: false, error: err.message || String(err) };
  }
}

/* ----------------- Core generation ----------------- */

async function generateUIFromPrompt(prompt) {
  // If no gemini SDK available, return a mock result quickly
  if (!genAI) {
    await new Promise(r => setTimeout(r, 300)); // simulate latency
    const mockHtml = `<div class="p-4 bg-gray-900 text-white rounded"><h1 class="text-xl font-bold">Mock UI for: ${escapeHtml(prompt.slice(0, 80))}</h1><p class="mt-2 text-sm">This is a mock output because GEMINI_API_KEY is not set.</p></div>`;
    return { html: mockHtml, notes: "mock" };
  }

  // Build the AI prompt
  const aiPrompt = generateUIPrompt(prompt);

  try {
    // Try a couple of SDK shapes — gracefully handle differences
    // 1) Newer SDK: genAI.responses.generate({ model, input })
    if (genAI && genAI.responses && typeof genAI.responses.generate === "function") {
      const r = await genAI.responses.generate({
        model: process.env.GENAI_MODEL || "models/text-bison-001",
        input: aiPrompt
      });
      const extracted = extractTextFromResponse(r);
      return { html: extracted, raw: r };
    }

    // 2) Older SDK shape: model generation flow
    if (genAI && typeof genAI.getGenerativeModel === "function") {
      const model = await genAI.getGenerativeModel({ model: process.env.GENAI_MODEL || "gemini-2.5-flash" });
      if (model && typeof model.generateContent === "function") {
        const resp = await model.generateContent({
          contents: [{ parts: [{ text: aiPrompt }] }]
        });
        const extracted = extractTextFromResponse(resp);
        return { html: extracted, raw: resp };
      }
    }

    // 3) Fallback generic call if present
    if (genAI && typeof genAI.generateText === "function") {
      const resp = await genAI.generateText(aiPrompt, { model: process.env.GENAI_MODEL || "models/text-bison-001" });
      const extracted = extractTextFromResponse(resp);
      return { html: extracted, raw: resp };
    }

    // If we reach here, SDK shape unknown — return a helpful error
    return { html: "", notes: "unsupported-sdk-shape" };
  } catch (err) {
    console.error("AI generation failed:", err && err.stack ? err.stack : err);
    throw err;
  }
}

// small helper to HTML-escape strings used in mock
function escapeHtml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --------------- Routes --------------- */

/**
 * POST /generate
 * body: { prompt: string, projectId?: string }
 * Response: { ok: true, project: { id, prompt, files: [{path, content}], summary, createdAt } }
 */
router.post("/generate", async (req, res) => {
  try {
    const { prompt = "", projectId } = req.body || {};
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: "Prompt required" });

    // Generate UI (either real or mock)
    const result = await generateUIFromPrompt(prompt);
    const html = result.html || result.raw || "<!-- empty -->";

    // Normalize into files array
    const files = [
      { path: "generated.html", content: String(html) }
    ];

    const id = projectId || `proj_${Date.now()}`;
    const project = {
      id,
      prompt,
      files,
      summary: result.notes || `Generated ${files.length} files`,
      createdAt: new Date().toISOString()
    };

    // Persist to disk (best-effort)
    persistProjectToDisk(project);

    // Optional: save to DB if Model exists
    if (Model) {
      try {
        const doc = new Model({
          prompt,
          generatedCode: html,
          createdAt: new Date()
        });
        await doc.save();
      } catch (e) {
        console.warn("DB save failed:", e.message || e);
      }
    }

    return res.json({ ok: true, project });
  } catch (err) {
    console.error("POST /user/ai/generate error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: err.message || "Internal error" });
  }
});

/* CRUD endpoints for GeneratedUi model (reuse existing code) */

// Add new saved generated UI (DB)
router.post("/add", (req, res) => {
  if (!Model) return res.status(500).json({ error: "Model not available" });
  new Model(req.body).save()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

// Delete
router.delete("/delete/:id", (req, res) => {
  if (!Model) return res.status(500).json({ error: "Model not available" });
  Model.findByIdAndDelete(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

// Update
router.put("/update/:id", (req, res) => {
  if (!Model) return res.status(500).json({ error: "Model not available" });
  Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

// Get all
router.get("/getall", (req, res) => {
  if (!Model) return res.status(500).json({ error: "Model not available" });
  Model.find()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
