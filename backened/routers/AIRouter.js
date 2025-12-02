require("dotenv").config();
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

let Model = null;
try {
  Model = require("../models/GeneratedUi.js");
} catch (e) {
  console.warn("GeneratedUi model not found, DB save will skip");
}

/* AI-powered UI generation using Gemini */
async function generateUIFromPrompt(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("⚠️  GEMINI_API_KEY not set, using mock generation");
      return generateMockUI(prompt);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const aiPrompt = `You are an expert frontend developer. Generate a production-ready HTML component using Tailwind CSS.

User Request: ${prompt}

Requirements:
1. Return ONLY valid HTML code (no markdown, no explanations, no backticks)
2. Use Tailwind CSS utility classes only
3. Make it responsive and modern
4. Include proper spacing and typography
5. Add hover/focus states for interactivity
6. Ensure accessibility
7. Must start with <div> and end with </div>

Generate the HTML now:`;

    console.log('🔄 Calling Gemini API...');
    const result = await model.generateContent(aiPrompt);
    
    if (!result || !result.response) {
      console.error('Invalid response from Gemini');
      return generateMockUI(prompt);
    }

    let generatedCode = result.response.text();
    
    // Clean up markdown if present
    generatedCode = generatedCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('✅ AI Generated UI successfully');
    return generatedCode;

  } catch (err) {
    console.error('⚠️  AI generation failed:', err.message);
    console.error('Error details:', err);
    return generateMockUI(prompt);
  }
}

/* Fallback mock UI if API fails */
function generateMockUI(prompt) {
  return `<div class="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-indigo-200 max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-800 mb-3">Generated Component</h2>
    <p class="text-gray-600 mb-6">Prompt: <span class="font-semibold text-indigo-600">${prompt}</span></p>
    
    <div class="space-y-4 mb-6">
      <div class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
        <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800">Feature One</h3>
          <p class="text-sm text-gray-500">Description of feature one</p>
        </div>
      </div>

      <div class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
        <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800">Feature Two</h3>
          <p class="text-sm text-gray-500">Description of feature two</p>
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

/**
 * POST /generate
 * body: { prompt: string }
 */
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('📝 Generating UI for prompt:', prompt);
    
    // Generate HTML with AI
    const generatedCode = await generateUIFromPrompt(prompt);

    // Optional: Save to DB
    let savedData = {
      _id: `proj_${Date.now()}`,
      prompt: prompt,
      generatedCode: generatedCode,
      createdAt: new Date(),
    };

    if (Model) {
      try {
        const doc = new Model({
          prompt: prompt,
          generatedCode: generatedCode,
        });
        savedData = await doc.save();
        console.log('✅ Saved to DB:', savedData._id);
      } catch (dbErr) {
        console.warn('⚠️  DB save failed, continuing:', dbErr.message);
      }
    }

    res.status(200).json({
      ok: true,
      data: savedData,
    });

  } catch (err) {
    console.error('❌ Generate endpoint error:', err.message);
    res.status(500).json({ 
      error: err.message || 'Generation failed',
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
});

router.post("/add", (req, res) => {
  res.json({ message: "Add endpoint" });
});

router.delete("/delete/:id", (req, res) => {
  res.json({ message: "Delete endpoint" });
});

router.put("/update/:id", (req, res) => {
  res.json({ message: "Update endpoint" });
});

router.get("/getall", (req, res) => {
  res.json({ message: "GetAll endpoint" });
});

module.exports = router;