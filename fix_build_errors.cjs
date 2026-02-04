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

console.log('Starting Build Error Fixes in:', targetDir);

walkDir(targetDir, (filePath) => {
    if (!filePath.endsWith('.tsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Simple Replacements (SVG props, etc)
    const replacements = [
        { from: /viewbox=/g, to: 'viewBox=' },
        { from: /preserveaspectratio=/g, to: 'preserveAspectRatio=' },
        { from: /lineargradient/g, to: 'linearGradient' },
        { from: /checked=""/g, to: 'checked={true}' },
        { from: /align="center"/g, to: '' }, // Button align is invalid in React
    ];

    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });

    // 2. Complex Style Fixer: style="width: 100%; color: red" -> style={{ width: '100%', color: 'red' }}
    content = content.replace(/style="([^"]+)"/g, (match, css) => {
        // Don't touch if it already looks like an object (unlikely given the regex, but safety first)
        if (css.includes('{{')) return match;

        const props = css.split(';').filter(Boolean).map(rule => {
            let parts = rule.split(':');
            if (parts.length < 2) return '';
            
            let key = parts[0].trim();
            // Value is the rest joined back (in case value has :)
            let val = parts.slice(1).join(':').trim(); 
            
            // Convert kebab-case to camelCase
            const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            
            // Escape quotes in value
            val = val.replace(/"/g, "'");
            
            // Handle numeric values if needed? React prefers strings for pixels usually unless number.
            // But quoting everything is safer for now.
            return `${camelKey}: "${val}"`; 
        }).filter(Boolean).join(', ');
        
        return `style={{ ${props} }}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`FIXED: ${filePath}`);
    }
});

console.log('Build Fixes Complete.');
