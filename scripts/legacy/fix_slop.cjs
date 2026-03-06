const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDir = path.join(__dirname, 'src', 'features');

console.log('Starting Cleanup in:', targetDir);

walkDir(targetDir, (filePath) => {
    if (!filePath.endsWith('.tsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Fix HTML Comments: <!-- --> to {/* */}
    // [\s\S] matches newlines too
    content = content.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // 2. Fix Style: style='background-image: url("...")'
    // Regex matches the single-quoted style attribute with the url() inside
    content = content.replace(/style='background-image:\s*url\("([^"]+)"\);?'/g, (match, url) => {
        return `style={{ backgroundImage: 'url("${url}")' }}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`FIXED: ${filePath}`);
    }
});

console.log('Cleanup Complete.');
