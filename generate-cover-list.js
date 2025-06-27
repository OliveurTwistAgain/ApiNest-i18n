// generate-cover-list.js

const fs = require("fs");
const path = require("path");

const coversDir = path.join(__dirname, "static", "covers"); // mis à jour
const outputFile = path.join(__dirname, "src", "components", "common", "coverList.js");

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const images = fs
    .readdirSync(coversDir)
    .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
    .sort();

const output = `// AUTO-GENERATED. Run 'node generate-cover-list.js' to update.
export const coverList = [
${images.map((img) => `    "${img}"`).join(",\n")}
];
`;

fs.writeFileSync(outputFile, output);
console.log(`✅ coverList.js updated with ${images.length} images.`);
