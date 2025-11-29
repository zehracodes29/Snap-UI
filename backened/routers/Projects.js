const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { generateAIUI } = require("../utils/ai");

router.post("/:id/generated", async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // generate React/Tailwind code from AI
    const generatedCode = await generateAIUI(prompt);

    // save generated code to project
    const project = await Project.findByIdAndUpdate(
      id,
      { generatedCode },
      { new: true }
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({ generatedCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

module.exports = router;
