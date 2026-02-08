require("dotenv").config();
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

let Model = null;
try {
  Model = require("../models/GeneratedUi.js");
} catch (e) {
  console.warn("⚠️  GeneratedUi model not loaded");
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI-powered UI generator using Gemini
async function generateUIFromPrompt(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const enhancedPrompt = `You are an expert web developer and UI/UX designer. Generate complete, production-ready HTML code based on the following user request. 

IMPORTANT REQUIREMENTS:
1. Generate a SINGLE, complete HTML file with embedded CSS in a <style> tag
2. Make it visually stunning with modern design principles
3. Use proper semantic HTML5
4. Include professional styling with gradients, shadows, and animations
5. Make it fully responsive
6. Use a modern color palette
7. DO NOT include any markdown code blocks, backticks, or explanatory text
8. Return ONLY the raw HTML code, nothing else
9. Ensure all styles are embedded in the HTML

User Request: ${prompt}

Generate the complete HTML now:`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let generatedCode = response.text();

    // Clean up the response - remove markdown code blocks if present
    generatedCode = generatedCode
      .replace(/```html\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    // Ensure we have valid HTML
    if (!generatedCode.includes('<html') && !generatedCode.includes('<!DOCTYPE')) {
      // Wrap in basic HTML structure if not present
      generatedCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated UI</title>
</head>
<body>
${generatedCode}
</body>
</html>`;
    }

    return generatedCode;

  } catch (error) {
    console.error('❌ Gemini AI Error:', error.message);

    // Fallback to a nice error UI
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generation Error</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .error-container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 { color: #e53e3e; font-size: 24px; margin-bottom: 15px; }
    p { color: #4a5568; line-height: 1.6; margin-bottom: 10px; }
    .prompt { 
      background: #f7fafc; 
      padding: 15px; 
      border-radius: 8px; 
      margin: 20px 0;
      border-left: 4px solid #667eea;
    }
    code { color: #667eea; font-weight: 600; }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>⚠️ Generation Error</h1>
    <p>Unable to generate UI from the prompt. Please try again.</p>
    <div class="prompt">
      <strong>Your prompt:</strong><br>
      <code>${prompt}</code>
    </div>
    <p><small>Error: ${error.message}</small></p>
  </div>
</body>
</html>`;
  }
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