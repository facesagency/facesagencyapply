/**
 * ============================================================
 *  FACES AGENCY — Local Folder Automation Server
 *  Version: 1.1
 *  Port: 3000
 * ============================================================
 *  Receives POST requests from n8n (via ngrok tunnel) and
 *  automatically creates talent folders on your Mac in the
 *  correct location based on gender.
 *
 *  Folder structure created:
 *  FACES DATABASE/
 *    Males/   → F-0001_John Doe/
 *    Females/ → F-0002_Jane Smith/
 * ============================================================
 */

const http   = require('http');
const fs     = require('fs');
const path   = require('path');

// ─── CONFIG ──────────────────────────────────────────────────
const BASE_PATH   = '/Users/facesagency/Desktop/FACES DATABASE';
const PORT        = 3000;
const SECRET_KEY  = 'faces2024';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY || '';
// ─────────────────────────────────────────────────────────────

function ensureBaseFolders() {
  ['Males', 'Females'].forEach(sub => {
    const dir = path.join(BASE_PATH, sub);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`📁 Created base folder: ${dir}`);
    }
  });
}

function sanitiseName(name = '') {
  return name
    .trim()
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\s+/g, ' ');
}

function log(msg) {
  const ts = new Date().toLocaleString('en-GB', { hour12: false });
  console.log(`[${ts}] ${msg}`);
}

// ─── GET NEXT FREE TALENT ID FROM HUBSPOT ────────────────────
async function getNextTalentId() {
  log('🔍 Fetching all existing talent IDs from HubSpot...');

  let allContacts = [];
  let after = undefined;

  // Fetch all contacts that already have a talent_id
  do {
    const body = {
      filterGroups: [{ filters: [{ propertyName: 'talent_id', operator: 'HAS_PROPERTY' }] }],
      properties: ['talent_id'],
      limit: 100,
      ...(after && { after }),
    };

    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      log(`❌ HubSpot API error: ${JSON.stringify(data)}`);
      throw new Error('Failed to fetch contacts from HubSpot');
    }

    allContacts = allContacts.concat(data.results || []);
    after = data.paging?.next?.after;
  } while (after);

  // Build a SET of all existing IDs for fast lookup
  const existingIds = new Set(
    allContacts
      .map(c => c.properties?.talent_id)
      .filter(Boolean)
  );

  log(`📋 Found ${existingIds.size} existing talent IDs`);

  // Find the highest number currently used
  let maxNum = 0;
  for (const id of existingIds) {
    const match = id.match(/^F-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  // Find the next number that is NOT already taken
  let nextNum = maxNum + 1;
  while (existingIds.has(`F-${String(nextNum).padStart(4, '0')}`)) {
    nextNum++;
  }

  const newId = `F-${String(nextNum).padStart(4, '0')}`;
  log(`✅ Next free talent ID: ${newId}`);
  return newId;
}

// ─── REQUEST HANDLER ─────────────────────────────────────────
const server = http.createServer((req, res) => {

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'Faces Automation Server v1.1' }));
    return;
  }

  // ── GET /next-id — returns the next available F-XXXX ID ──
  if (req.method === 'GET' && req.url === '/next-id') {
    getNextTalentId()
      .then(talentId => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ talentId }));
      })
      .catch(err => {
        log(`❌ Error getting next ID: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // Only handle POST /create-folder
  if (req.method !== 'POST' || req.url !== '/create-folder') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // ── Auth check ───────────────────────────────────────────
  const authHeader = req.headers['x-faces-key'];
  if (authHeader !== SECRET_KEY) {
    log(`🚫 Unauthorised request blocked`);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorised' }));
    return;
  }

  // ── Read body ────────────────────────────────────────────
  let body = '';
  req.on('data', chunk => { body += chunk; });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);

      const { talentId, fullName, gender } = data;

      if (!talentId || !fullName || !gender) {
        log(`⚠️  Missing fields — received: ${JSON.stringify(data)}`);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required fields: talentId, fullName, gender' }));
        return;
      }

      const genderNorm = gender.trim().toLowerCase();
      let genderFolder;

      if (genderNorm === 'male' || genderNorm === 'm') {
        genderFolder = 'Males';
      } else if (genderNorm === 'female' || genderNorm === 'f') {
        genderFolder = 'Females';
      } else {
        genderFolder = 'Unclassified';
        log(`⚠️  Unknown gender "${gender}" — placing in Unclassified/`);
      }

      const cleanName   = sanitiseName(fullName);
      const folderName  = `${talentId}_${cleanName}`;
      const targetPath  = path.join(BASE_PATH, genderFolder, folderName);

      if (fs.existsSync(targetPath)) {
        log(`⚠️  Folder already exists: ${targetPath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          created: false,
          message: 'Folder already exists',
          path: targetPath
        }));
        return;
      }

      fs.mkdirSync(targetPath, { recursive: true });
      log(`✅ Created: ${targetPath}`);

      const logLine = `${new Date().toISOString()} | ${talentId} | ${fullName} | ${genderFolder} | ${targetPath}\n`;
      const logFile = path.join(BASE_PATH, 'creation_log.txt');
      fs.appendFileSync(logFile, logLine);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        created: true,
        path: targetPath,
        folderName
      }));

    } catch (err) {
      log(`❌ Error: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  req.on('error', err => {
    log(`❌ Request error: ${err.message}`);
  });
});

// ─── START ───────────────────────────────────────────────────
ensureBaseFolders();

server.listen(PORT, '127.0.0.1', () => {
  log(`🎬 Faces Automation Server running on port ${PORT}`);
  log(`📂 Base path: ${BASE_PATH}`);
  log(`🔑 Auth key : ${SECRET_KEY}`);
  log(`🩺 Health   : http://127.0.0.1:${PORT}/health`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use. Kill the existing process first:\n   lsof -ti:${PORT} | xargs kill\n`);
  } else {
    console.error(`\n❌ Server error: ${err.message}`);
  }
  process.exit(1);
});
