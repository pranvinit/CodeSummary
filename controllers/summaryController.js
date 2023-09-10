const fs = require("fs-extra");
const path = require("path");
const AdmZip = require("adm-zip");
const {
  processDir,
  markdownFormatter,
  cleanup,
} = require("../utils/utilities");
const { openai } = require("../config/config");

const getSummary = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let uploadFiles = req.files.directory ?? req.files.files ?? req.files.file;
  if (uploadFiles && !Array.isArray(uploadFiles)) {
    uploadFiles = [uploadFiles];
  }

  const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads");
  const SUMMARIES_DIR = path.resolve(__dirname, "..", "summaries");

  let filesPaths = [];
  let contentData = "";

  try {
    for (let uploadFile of uploadFiles) {
      const targetPath = path.join(UPLOAD_DIR, uploadFile.name);
      filesPaths.push(targetPath);

      await fs.ensureDir(path.dirname(targetPath));
      await uploadFile.mv(targetPath);

      if (uploadFile.name.endsWith(".zip")) {
        const zip = new AdmZip(targetPath);
        zip.extractAllTo(
          path.join(UPLOAD_DIR, path.basename(uploadFile.name, ".zip")),
          true
        );

        const extractedPath = path.join(
          UPLOAD_DIR,
          path.basename(uploadFile.name, ".zip")
        );
        filesPaths.push(extractedPath);
        await processDir(extractedPath);
      } else {
        contentData += `File: ${uploadFile.name}\n`;
        contentData += `Content:\n${uploadFile.data.toString("utf-8")}\n\n`;
      }
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Given the files and their contents described below, please create a structured summary with the following guidelines:

1. List the main functionalities and structures evident in the code content. Start this section with the phrase "Main functionalities".
2. Provide a bullet-point summary for each file. Introduce each file with the prefix "File:" and clearly delineate between the file path and its content.
3. Ensure the summary is concise and avoids including any extraneous details.

Remember that this summary will be passed through a formatting function before being finalized. Please construct the summary with this in mind to avoid any syntax errors.
 \n ${contentData}`,
        },
      ],
    });
    const summaryText = chatCompletion.choices[0].message.content;
    const formattedSummary = markdownFormatter(summaryText);

    const summaryFilePath = path.join(SUMMARIES_DIR, "summary.md");
    await fs.outputFile(summaryFilePath, formattedSummary);

    res.download(summaryFilePath, "summary.md", async (err) => {
      if (err) {
        console.error("Failed to send the file:", err);
        res.status(500).send({ message: "Failed to send the file." });
      }

      await cleanup(filesPaths).catch((err) => {
        console.error("Failed to clean up files:", err);
      });
    });
  } catch (error) {
    console.error("An error occurred:", error);

    await cleanup(filesPaths).catch((err) => {
      console.error("Failed to clean up files:", err);
    });

    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = { getSummary };
