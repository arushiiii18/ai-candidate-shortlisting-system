const Candidate = require("../models/Candidate");

const addCandidate = async (req, res) => {
    try {
        const candidate = new Candidate(req.body);

        await candidate.save();

        res.status(201).json({
            message: "Candidate added successfully",
            candidate
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();

        res.status(200).json(candidates);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    addCandidate,
    getCandidates
};