const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');

function isDecorative(line) {
  // Remove single-line comment blocks that are mostly separators like // ======== or /* ===== */
  if (/^\s*\/\/\s*[-=*_]{3,}\s*$/.test(line)) return true;
  if (/^\s*\/\*\s*[-=*_]{3,}\s*\*\/\s*$/.test(line)) return true;
  if (/^\s*\/\/\s*={2,}.*={2,}\s*$/.test(line)) return true;
  if (/^\s*\/\*\s*={2,}.*={2,}\s*\*\/\s*$/.test(line)) return true;
  return false;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && (full.endsWith('.js') || full.endsWith('.jsx'))) {
      const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
      const filtered = lines.filter(l => !isDecorative(l));
      const out = filtered.join('\n');
      if (out !== lines.join('\n')) {
        fs.writeFileSync(full, out, 'utf8');
        console.log('Cleaned comments:', full);
      }
    }
  }
}

walk(root);
console.log('Done');
