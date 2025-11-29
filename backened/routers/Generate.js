// backend/src/routes/generate.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Simple mock generation for dev if no API key
async function generateMock(prompt) {
  await new Promise(res => setTimeout(res, 800));
  const react = `export default function Generated() {\n  return (\n    <div className="p-6 bg-white rounded">\n      <h1>${escapeHtml(prompt.slice(0,120))}</h1>\n      <p>This is a mock generated UI.</p>\n    </div>\n  );\n}\n`;
  return { react, html: `<div><h1>${escapeHtml(prompt)}</h1><p>Mock UI</p></div>`, css: '', notes: 'mock' };
}

function escapeHtml(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

router.post('/', async (req, res) => {
  try {
    const { prompt = '' } = req.body || {};
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'Prompt required' });
    if (!OPENAI_API_KEY) {
      const mock = await generateMock(prompt);
      return res.json({ mode: 'mock', ...mock });
    }

    // Example OpenAI Chat Completions call — adapt if using another provider
    const system = `You are an assistant that returns JSON { "react": "...", "html": "...", "css": "...", "notes": "..." } only.`;
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
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });
    const text = resp.data?.choices?.[0]?.message?.content;
    // Try parse JSON
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) {
      const first = text.indexOf('{'), last = text.lastIndexOf('}');
      if (first !== -1 && last !== -1) parsed = JSON.parse(text.slice(first, last+1));
      else throw new Error('Model returned unparsable content');
    }
    return res.json({ mode: 'openai', ...parsed });
  } catch (err) {
    console.error('POST /api/generate error', err);
    return res.status(500).json({ error: err.message || 'Internal' });
  }
});

module.exports = router;
