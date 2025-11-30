const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const connectToDatabase = require('../lib/mongoose');

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2,8)}`;
}

// POST /api/projects  -> create new project and return id
router.post('/', async (req, res) => {
  try {
    // await connectToDatabase();
    const { title = 'Untitled Project', type = 'UI', status = 'Planned', meta = {}, owner } = req.body || {};
    const project = new Project({ title: String(title).slice(0,200), type, status, meta, owner });
    await project.save();
    return res.status(201).json({ id: project._id.toString(), project: format(project) });
  } catch (err) {
    console.error('POST /api/projects', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /api/projects -> list (paginated support)
router.get('/', async (req, res) => {
  try {
    // await connectToDatabase();
    const limit = Math.min(parseInt(req.query.limit || '20'), 100);
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const skip = (page - 1) * limit;
    const docs = await Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return res.json({ projects: docs.map(format) });
  } catch (err) {
    console.error('GET /api/projects', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

// GET /api/projects/:id -> single project
router.get('/:id', async (req, res) => {
  try {
    // await connectToDatabase();
    const id = req.params.id;
    const project = await Project.findById(id).lean();
    if (!project) return res.status(404).json({ error: 'Not found' });
    return res.json({ project: format(project) });
  } catch (err) {
    console.error('GET /api/projects/:id', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

function format(p) {
  if (!p) return p;
  // ensure id & iso strings
  return {
    id: p._id?.toString?.() || p.id,
    title: p.title,
    type: p.type,
    status: p.status,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
    lastGeneratedAt: p.lastGeneratedAt ? new Date(p.lastGeneratedAt).toISOString() : null,
    meta: p.meta || {},
    generatedVersions: (p.generatedVersions || []).map(g => ({
      gid: g.gid,
      code: g.code,
      meta: g.meta,
      createdAt: g.createdAt ? new Date(g.createdAt).toISOString() : null
    }))
  };
}

module.exports = router;
