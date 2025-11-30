// backend/src/routes/generate.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Simple mock generation for dev if no API key
async function generateMock(prompt) {
  await new Promise(res => setTimeout(res, 800));
  const react = `export default function Generated() {\n  return (\n    <div className="p-6 bg-white rounded">\n      <h1>${escapeHtml(prompt.slice(0,120))}</h1>\n      <p>This is a mock generated UI.</p>\n    </div>\n  );\n}\n`;
  return { react, html: `<div><h1>${escapeHtml(prompt)}</h1><p>Mock UI</p></div>`, css: '', notes: 'mock' };
}

function escapeHtml(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/**
 * Helper: try to extract JSON object from a string that might contain
 * leading/trailing text (e.g. markdown, commentary).
 */
function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last < first) return null;
  const candidate = text.slice(first, last + 1);
  try {
    return JSON.parse(candidate);
  } catch (e) {
    // Last resort: replace smart quotes and try again
    const cleaned = candidate.replace(/\u2018|\u2019|\u201C|\u201D/g, '"');
    try { return JSON.parse(cleaned); } catch (_) { return null; }
  }
}

/**
 * Persist a project object to disk under ./data/projects/<id>.json
 * Uses process.cwd() as project root (typical when running node from backend root).
 */
function persistProject(project) {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'projects');
    fs.mkdirSync(dataDir, { recursive: true });
    const outPath = path.join(dataDir, `${project.id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(project, null, 2), 'utf8');
    return { ok: true, path: outPath };
  } catch (err) {
    console.warn('persistProject error', err);
    return { ok: false, error: err.message || String(err) };
  }
}

router.post('/', async (req, res) => {
  try {
    const { prompt = '' } = req.body || {};
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'Prompt required' });

    // Build project id
    const id = `proj_${Date.now()}`;

    // If no API key, use mock generator
    let generated;
    let mode = 'mock';
    if (!OPENAI_API_KEY) {
      generated = await generateMock(prompt);
      mode = 'mock';
    } else {
      // Example OpenAI Chat Completions call
      const system = `You are an assistant that returns ONLY a JSON object with keys: "react", "html", "css", "notes" (all strings). Do not wrap in markdown.`;
      const payload = {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Create a single-file React component for this prompt:\n\n${prompt}\n\nReturn only JSON.` }
        ],
        max_tokens: 1500,
        temperature: 0.2
      };

      const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const text = resp.data?.choices?.[0]?.message?.content || resp.data?.choices?.[0]?.text || '';
      // Try parse JSON robustly
      const parsed = (() => {
        try {
          return JSON.parse(text);
        } catch (e) {
          return extractJson(text);
        }
      })();

      if (!parsed) {
        // If parsing fails, keep raw text as output
        generated = { react: '', html: '', css: '', notes: 'raw', raw: text };
      } else {
        generated = parsed;
      }
      mode = 'openai';
    }

    // Normalize files array
    const files = [];
    // If model already returned files array
    if (Array.isArray(generated.files) && generated.files.length) {
      generated.files.forEach(f => {
        if (f && f.path && typeof f.content === 'string') files.push({ path: f.path, content: f.content });
      });
    } else {
      // Build files from common keys
      if (generated.react) files.push({ path: 'Generated.jsx', content: generated.react });
      if (generated.html) files.push({ path: 'generated.html', content: generated.html });
      if (generated.css) files.push({ path: 'styles.css', content: generated.css });
      if (generated.raw && !generated.react && !generated.html) {
        files.push({ path: 'output.txt', content: generated.raw });
      }
      // If still empty, put a placeholder
      if (files.length === 0) {
        files.push({ path: 'output.txt', content: JSON.stringify(generated, null, 2) });
      }
    }

    const project = {
      id,
      prompt,
      mode,
      files,
      summary: generated.notes || (Array.isArray(files) ? `Generated ${files.length} file(s)` : ''),
      createdAt: new Date().toISOString()
    };

    // Persist to disk (best-effort)
    const persistResult = persistProject(project);
    if (!persistResult.ok) {
      // Not fatal; just warn and continue
      console.warn('Warning: failed to persist project:', persistResult.error);
    }

    // Return project to client
    return res.json({ ok: true, project });
  } catch (err) {
    console.error('POST /api/generate error', err);
    return res.status(500).json({ error: err.message || 'Internal' });
  }
});

module.exports = router;
