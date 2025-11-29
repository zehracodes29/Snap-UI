// frontend/src/app/api/projects/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'projects.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch (err) {
    // create file with empty array if not exists
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

function generateId() {
  // Simple unique id: timestamp + short random hex
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2,8)}`;
}

export async function POST(req) {
  try {
    // Validate body (optional fields allowed)
    const body = await req.json().catch(() => ({}));
    const title = (body.title || 'Untitled Project').toString().slice(0,200);

    await ensureDataFile();

    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const projects = JSON.parse(raw || '[]');

    const id = generateId();
    const newProject = {
      id,
      title,
      type: body.type || 'UI',
      status: body.status || 'Planned',
      createdAt: new Date().toISOString(),
      // optionally keep any other metadata from body
      meta: body.meta || {},
    };

    projects.unshift(newProject);
    await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf8');

    return NextResponse.json({ id, project: newProject }, { status: 201 });
  } catch (err) {
    console.error('API /api/projects error', err);
    return NextResponse.json({ error: (err && err.message) || 'Internal' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const projects = JSON.parse(raw || '[]');
    return NextResponse.json({ projects });
  } catch (err) {
    console.error('GET /api/projects error', err);
    return NextResponse.json({ error: err.message || 'Internal' }, { status: 500 });
  }
}
