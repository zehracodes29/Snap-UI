const express = require('express');
const router = express.Router();
const GeneratedUI = require('../models/GeneratedUi');
const auth = require('../middleware/auth'); // your JWT middleware

// Get all generated UIs for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const data = await GeneratedUI.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new UI generation record
router.post('/', auth, async (req, res) => {
  try {
    const newUI = new GeneratedUI({
      userId: req.user.id,
      title: req.body.title,
      codeInput: req.body.codeInput,
      uiOutput: req.body.uiOutput
    });
    await newUI.save();
    res.status(201).json(newUI);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
