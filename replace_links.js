const fs = require('fs');
const glob = require('glob');

const replaceFiles = () => {
  const files = glob.sync('src/pages/**/*.astro', { absolute: true });
  let changes = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
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
      fs.writeFileSync(file, content, 'utf8');
      changes++;
      console.log('Updated: ', file);
    }
  });
  console.log('Total files changed: ', changes);
};
replaceFiles();
