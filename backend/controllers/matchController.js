const Candidate = require("../models/Candidate");
const axios = require("axios");

const matchCandidates = async (req, res) => {
    try {

        const { requiredSkills, minExperience } = req.body;

        const candidates = await Candidate.find();

        const rankedCandidates = candidates.map(candidate => {

            const matchedSkills = candidate.skills.filter(skill =>
                requiredSkills.includes(skill)
            );

            const matchScore =
                (matchedSkills.length / requiredSkills.length) * 100;

            let ranking = "Low";

            if (matchScore >= 80) {
                ranking = "High";
            } else if (matchScore >= 50) {
                ranking = "Medium";
            }

            return {
                name: candidate.name,
                email: candidate.email,
                skills: candidate.skills,
                experience: candidate.experience,
                matchedSkills,
                matchScore,
                ranking
            };

        }).filter(candidate =>
            candidate.experience >= minExperience
        );

        rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

        res.status(200).json(rankedCandidates);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
const aiShortlist = async (req, res) => {

    try {

        const { requiredSkills, minExperience } = req.body;

        const candidates = await Candidate.find();

        const candidateText = candidates.map((c, index) => `
${index + 1}. ${c.name} - Skills: ${c.skills.join(", ")} - Experience: ${c.experience} years
        `).join("\n");

        const prompt = `
Job requires:
Skills: ${requiredSkills.join(", ")}
Minimum Experience: ${minExperience} years

Candidates:
${candidateText}

Rank candidates from best to worst and explain why each candidate is suitable.
`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(200).json({
            aiResponse: response.data.choices[0].message.content
        });

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    matchCandidates,
    aiShortlist
};