const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('sw.js')) results.push(file);
    }
  });
  return results;
};

const files = walk('c:/toolshub');

files.forEach(f => {
  if (f.includes('node_modules')) return;
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  if (content.includes('localSettings.js') || content.includes('LocalSettings')) {
    content = content.replace(/storage\.js/g, 'localSettings.js');
    content = content.replace(/\bStorage\b/g, 'LocalSettings');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
