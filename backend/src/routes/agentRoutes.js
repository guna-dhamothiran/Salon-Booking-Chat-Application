const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

router.post("/message", agentController.handleMessage);

module.exports = router;
