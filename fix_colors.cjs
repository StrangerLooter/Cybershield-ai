const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.css') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('accent-cyan')) {
      content = content.replace(/accent-cyan/g, 'accent-primary');
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
