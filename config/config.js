require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = { openai };
