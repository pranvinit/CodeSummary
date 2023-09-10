const express = require("express");
const { getSummary } = require("../controllers/summaryController");

const router = express.Router();

router.post("/upload", getSummary);

module.exports = router;
