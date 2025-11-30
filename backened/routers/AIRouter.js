const express = require('express');
const Model = require('../models/GeneratedUi.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
require("dotenv").config();

const router = express();


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

Return ONLY the HTML code without explanations, wrapped in a code block with \`\`\`html tags.`;
};

const generateUI = async (prompt) => {
    const aiPrompt = generateUIPrompt(prompt);

    const model = await genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const response = await model.generateContent({
        contents: [
            {
                parts: [{ text: aiPrompt }],
            },
        ],
    });

    const uiCode = extractTextFromResponse(response);
    return uiCode;
}

router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Generate UI code from AI
        const generatedUICode = await generateUI(prompt);

        // Save to database
        // const aiContent = new Model({
        //     prompt: prompt,
        //     generatedCode: generatedUICode,
        //     createdAt: new Date()
        // });

        // const savedResult = await aiContent.save();

        res.status(200).json({
            success: true,
            // data: savedResult,
            code: generatedUICode
        });

    } catch (err) {
        console.error('Generate error:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Failed to generate UI'
        });
    }
});

router.post('/add', (req, res) => {
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

//delete operation

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


//update operation
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {
    Model.find()//find is also an asynchronous operation
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});



module.exports = router;