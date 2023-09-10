const fs = require("fs-extra");
const path = require("path");

const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads");
const SUMMARIES_DIR = path.resolve(__dirname, "..", "summaries");

async function processDir(dir, relativePath = "") {
  let dirContent = "";
  const files = await fs.readdir(dir);
  for (const file of files) {
    const absolutePath = path.join(dir, file);
    const stat = await fs.stat(absolutePath);
    if (stat.isDirectory()) {
      await processDir(absolutePath, path.join(relativePath, file));
    } else {
      try {
        const content = await fs.readFile(absolutePath, "utf-8");
        dirContent += `File: ${path.join(relativePath, file)}\n`;
        dirContent += `Content:\n${content}\n\n`;
      } catch (error) {
        dirContent += `File: ${path.join(relativePath, file)}\n`;
        dirContent += `Content: Binary or unreadable content\n\n`;
      }
    }
  }

  return dirContent;
}

const cleanup = async (filesPaths) => {
  for (let filePath of filesPaths) {
    try {
      await fs.remove(filePath);
    } catch (err) {
      console.error(`Failed to remove file/directory at ${filePath}:`, err);
    }
  }

  try {
    await fs.remove(UPLOAD_DIR);
    await fs.remove(SUMMARIES_DIR);
  } catch (err) {
    console.error("Failed to remove upload and summaries directories:", err);
  }
};

const markdownFormatter = (summaryText) => {
  const formattedText = summaryText
    .split("\n")
    .map((line) => {
      if (line.startsWith("Main functionalities")) {
        return `## ${line}`;
      } else if (line.startsWith("File:")) {
        return `### ${line}`;
      } else if (line.trim() === "") {
        return "";
      } else {
        return ` ${line}`;
      }
    })
    .join("\n");

  return formattedText;
};

module.exports = { processDir, cleanup, markdownFormatter };
