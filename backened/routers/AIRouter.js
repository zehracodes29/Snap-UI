require("dotenv").config();
const express = require("express");
const router = express.Router();

let Model = null;
try {
  Model = require("../models/GeneratedUi.js");
} catch (e) {
  console.warn("⚠️  GeneratedUi model not loaded");
}

// Mock UI generator
async function generateUIFromPrompt(prompt) {
  return `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom right, #eff6ff, #e0e7ff); border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #c7d2fe; padding: 30px; }
    h2 { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 15px; }
    .prompt-text { color: #4b5563; margin-bottom: 25px; }
    .prompt-text span { font-weight: 600; color: #4f46e5; }
    .features { margin-bottom: 25px; }
    .feature-item { display: flex; gap: 12px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 12px; transition: box-shadow 0.3s; }
    .feature-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .feature-icon { width: 45px; height: 45px; background: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white; font-weight: bold; }
    .feature-content h3 { font-weight: 600; color: #1f2937; margin-bottom: 3px; }
    .feature-content p { font-size: 14px; color: #6b7280; }
    .buttons { display: flex; gap: 12px; }
    .btn { flex: 1; padding: 12px 20px; font-size: 15px; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #4f46e5; color: white; }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary { background: white; color: #4f46e5; border: 2px solid #4f46e5; }
    .btn-secondary:hover { background: #f0f4ff; }
  </style>
  <div class="container">
    <h2>Generated Component</h2>
    <p class="prompt-text">Prompt: <span>${prompt}</span></p>
    <div class="features">
      <div class="feature-item">
        <div class="feature-icon">✓</div>
        <div class="feature-content">
          <h3>Feature</h3>
          <p>Generated from your prompt: ${prompt}</p>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="btn btn-primary">Get Started</button>
      <button class="btn btn-secondary">Learn More</button>
    </div>
  </div>`;
}

// POST /generate endpoint
router.post("/generate", async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    
    console.log('🔄 Generate request received');
    console.log('   Prompt:', prompt);
    console.log('   UserId:', userId || 'anonymous');

    if (!prompt || prompt.trim() === "") {
      console.log('❌ Prompt is empty');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate code
    const generatedCode = await generateUIFromPrompt(prompt);
    console.log('✅ Code generated:', generatedCode.length, 'characters');

    // Try to save to DB
    let savedData = {
      _id: `proj_${Date.now()}`,
      prompt: prompt,
      generatedCode: generatedCode,
      userId: userId || 'anonymous_user',
      createdAt: new Date(),
    };

    if (Model) {
      try {
        const doc = new Model({
          prompt: prompt,
          generatedCode: generatedCode,
          userId: userId || 'anonymous_user',
        });
        savedData = await doc.save();
        console.log('✅ Saved to DB:', savedData._id);
      } catch (dbErr) {
        console.warn('⚠️  DB save failed:', dbErr.message);
      }
    }

    res.status(200).json({
      ok: true,
      data: savedData,
    });

  } catch (err) {
    console.error('❌ Error in /generate:', err.message);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

// Other routes
router.post("/add", (req, res) => res.json({ message: "Add endpoint" }));
router.delete("/delete/:id", (req, res) => res.json({ message: "Delete endpoint" }));
router.put("/update/:id", (req, res) => res.json({ message: "Update endpoint" }));
router.get("/getall", (req, res) => res.json({ message: "GetAll endpoint" }));

module.exports = router;