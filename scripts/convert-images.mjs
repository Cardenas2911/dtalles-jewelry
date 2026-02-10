import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public/images';
const quality = 80;

if (!fs.existsSync(publicDir)) {
    console.error('Directory not found:', publicDir);
    process.exit(1);
}

fs.readdir(publicDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.png') {
            const inputFile = path.join(publicDir, file);
            const outputFile = path.join(publicDir, path.basename(file, '.png') + '.webp');

            sharp(inputFile)
                .webp({ quality: quality })
                .toFile(outputFile)
                .then(info => {
                    console.log(`Converted ${file} to WebP (${info.size} bytes)`);
                    fs.unlinkSync(inputFile); // Remove original PNG
                    console.log(`Deleted original: ${file}`);
                })
                .catch(err => {
                    console.error('Error converting', file, err);
                });
        }
    });
});
