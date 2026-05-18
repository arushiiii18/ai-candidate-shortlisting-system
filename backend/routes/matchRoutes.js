const express = require("express");

const router = express.Router();

const {
    matchCandidates,
    aiShortlist
} = require("../controllers/matchController");

router.post("/match", matchCandidates);

router.post("/ai/shortlist", aiShortlist);

module.exports = router;