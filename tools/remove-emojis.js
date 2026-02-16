const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');

const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && (full.endsWith('.js') || full.endsWith('.jsx'))) {
      let src = fs.readFileSync(full, 'utf8');
      const cleaned = src.replace(emojiRegex, '');
      if (cleaned !== src) {
        fs.writeFileSync(full, cleaned, 'utf8');
        console.log('Updated:', full);
      }
    }
  }
}

walk(root);
console.log('Done');
