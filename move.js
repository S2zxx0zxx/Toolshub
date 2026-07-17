const fs = require('fs');

function mv(src, dest) {
  try {
    fs.renameSync(src, dest);
  } catch (e) {
    console.log(e.message);
  }
}

fs.mkdirSync('css/core', {recursive:true});
mv('css/variables.css', 'css/core/variables.css');

fs.mkdirSync('js/core', {recursive:true});
fs.mkdirSync('js/ai', {recursive:true});
fs.mkdirSync('js/tools', {recursive:true});

// We already moved some UI and Services. Let's move the rest of JS.
mv('js/main.js', 'js/core/app.js'); // Rename main.js to app.js
mv('js/toolSelector.js', 'js/tools/registry.js'); // toolSelector -> registry
mv('js/chat.js', 'js/ui/chatEngine.js'); // chat -> chatEngine
mv('js/utilityTools.js', 'js/tools/utilityTools.js');
mv('js/fileTools.js', 'js/tools/fileTools.js');

console.log("Moved successfully.");
