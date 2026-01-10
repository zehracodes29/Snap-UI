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
  return `<div class="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-indigo-200 max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-800 mb-3">Generated Component</h2>
    <p class="text-gray-600 mb-6">Prompt: <span class="font-semibold text-indigo-600">${prompt}</span></p>
    
    <div class="space-y-4 mb-6">
      <div class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
        <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800">Feature</h3>
          <p class="text-sm text-gray-500">Generated from your prompt: ${prompt}</p>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <button class="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200">
        Get Started
      </button>
      <button class="flex-1 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition duration-200">
        Learn More
      </button>
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