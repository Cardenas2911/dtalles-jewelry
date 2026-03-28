const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replaceFiles = () => {
  let changes = 0;
  
  walkDir('src/pages', (filePath) => {
    if (!filePath.endsWith('.astro')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace exact matches
    content = content.replace(/href=\"\/en\"/g, 'href=\"/\"');
    content = content.replace(/href: \"\/en\"/g, 'href: \"/\"');
    content = content.replace(/resolvePath\(\"\/en\"\)/g, 'resolvePath(\"/\")');
    
    // Replace path prefixes
    content = content.replace(/href=\"\/en\/([^\"]+)\"/g, 'href=\"/$1\"');
    content = content.replace(/href: \"\/en\/([^\"]+)\"/g, 'href: \"/$1\"');
    content = content.replace(/collectionUrl = \"\/en\/([^\"]+)\";/g, 'collectionUrl = \"/$1\";');

    if(content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      changes++;
      console.log('Updated: ', filePath);
    }
  });
  console.log('Total files changed: ', changes);
};

replaceFiles();
