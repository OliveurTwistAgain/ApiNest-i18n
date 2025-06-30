// generate-cover-list.js

const fs = require("fs");
const path = require("path");

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function generateList(dirPath, outputFilePath, exportName) {
    const images = fs
        .readdirSync(dirPath)
        .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
        .sort();

    const output = `// AUTO-GENERATED. Run 'node generate-cover-list.js' to update.
export const ${exportName} = [
${images.map((img) => `    "${img}"`).join(",\n")}
];
\n`;

    fs.writeFileSync(outputFilePath, output);
    console.log(`✅ ${path.basename(outputFilePath)} updated with ${images.length} images.`);
}

// Dossier et fichier pour les covers "prod"
const prodDir = path.join(__dirname, "static", "covers");
const prodOut = path.join(__dirname, "src", "components", "common", "coverList.js");
generateList(prodDir, prodOut, "coverList");

// Dossier et fichier pour les covers "local" (tests)
const localDir = path.join(__dirname, "static", "local-covers");
const localOut = path.join(__dirname, "src", "components", "common", "localCoverList.js");

// Ne crée le fichier que si le dossier local-covers existe
if (fs.existsSync(localDir)) {
    generateList(localDir, localOut, "localCoverList");
} else {
    console.warn("⚠️  'local-covers/' directory not found. Skipping localCoverList.js.");
}
