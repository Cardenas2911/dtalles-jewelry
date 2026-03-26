const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, callback);
        } else {
            callback(filepath);
        }
    });
};

const pagesDir = path.join(__dirname, 'src', 'pages');

// Fixes in /src/pages/es/ (moved ONE LEVEL DEEPER)
const esDir = path.join(pagesDir, 'es');
if (fs.existsSync(esDir)) {
    walk(esDir, (filepath) => {
        if (!filepath.endsWith('.astro') && !filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;
        let content = fs.readFileSync(filepath, 'utf8');
        // Add one level to relative imports (../ -> ../../, ./ -> ../)
        let newContent = content.replace(/(from|import)['"\s]+(\.\.?\/[^'"]+)['"]/g, (match, p1, p2) => {
            if (p2.startsWith('../')) {
                return `${p1} "../${p2}"`;
            } else if (p2.startsWith('./')) {
                return `${p1} ".${p2}"`; // ./ becomes ../
            }
            return match;
        });
        
        // Also fix dynamic imports or image sources depending on context if any
        if (content !== newContent) {
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`Updated ES: ${filepath}`);
        }
    });
}

// Fixes in root /src/pages/ (moved ONE LEVEL UP from en/)
fs.readdirSync(pagesDir).forEach(file => {
    const rootItem = path.join(pagesDir, file);
    if (!fs.statSync(rootItem).isDirectory() && rootItem.endsWith('.astro')) {
        let content = fs.readFileSync(rootItem, 'utf8');
        // Remove one level from relative imports (../../ -> ../, ../ -> ./)
        let newContent = content.replace(/(from|import)['"\s]+(\.\.\/[^'"]+)['"]/g, (match, p1, p2) => {
            if (p2.startsWith('../../')) {
                return `${p1} "${p2.substring(3)}"`;
            } else if (p2.startsWith('../')) {
                return `${p1} "./${p2.substring(3)}"`;
            }
            return match;
        });
        
        if (content !== newContent) {
            fs.writeFileSync(rootItem, newContent, 'utf8');
            console.log(`Updated ROOT: ${rootItem}`);
        }
    }
});

// Fixes in subdirectories of /src/pages/ (moved ONE LEVEL UP from en/...)
// Check subdirs of pages except 'es' and 'api'
fs.readdirSync(pagesDir).forEach(dir => {
    const subpath = path.join(pagesDir, dir);
    if (fs.statSync(subpath).isDirectory() && dir !== 'es' && dir !== 'api') {
        walk(subpath, (filepath) => {
            if (!filepath.endsWith('.astro') && !filepath.endsWith('.ts') && !filepath.endsWith('.tsx')) return;
            let content = fs.readFileSync(filepath, 'utf8');
            // Remove one level
            let newContent = content.replace(/(from|import)['"\s]+(\.\.\/[^'"]+)['"]/g, (match, p1, p2) => {
                if (p2.startsWith('../../')) {
                    return `${p1} "${p2.substring(3)}"`;
                } else if (p2.startsWith('../')) {
                    return `${p1} "./${p2.substring(3)}"`;
                }
                return match;
            });
            if (content !== newContent) {
                fs.writeFileSync(filepath, newContent, 'utf8');
                console.log(`Updated SUBDIR: ${filepath}`);
            }
        });
    }
});
