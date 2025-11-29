// backend/src/routes/generated.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const Project = require('../models/Project');
const connectToDatabase = require('../lib/mongoose');
const mongoose = require('mongoose');

function genGid() {
  return new mongoose.Types.ObjectId().toString();
}

// POST /api/projects/:id/generated
router.post('/:id/generated', async (req, res) => {
  try {
    await connectToDatabase();
    const id = req.params.id;
    const { code, meta = {} } = req.body || {};
    if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Missing code string' });

    // optional validation: code length limit (e.g. 200k chars)
    if (code.length > 200_000) return res.status(400).json({ error: 'Code too large' });

    const generatedEntry = {
      gid: genGid(),
      code,
      meta,
      createdAt: new Date()
    };

    // atomic update with $push to avoid race conditions
    const updated = await Project.findByIdAndUpdate(
      id,
      {
        $push: { generatedVersions: { $each: [generatedEntry], $position: 0 } },
        $set: { lastGeneratedAt: generatedEntry.createdAt }
      },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Project not found' });
    return res.status(201).json({
      success: true,
      generated: {
        gid: generatedEntry.gid,
        code: generatedEntry.code,
        meta: generatedEntry.meta,
        createdAt: generatedEntry.createdAt.toISOString()
      },
      projectId: id
    });
  } catch (err) {
    console.error('POST /api/projects/:id/generated', err);
    return res.status(500).json({ error: err.message || 'Internal' });
  }
});

module.exports = router;
