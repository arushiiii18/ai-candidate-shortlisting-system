import "./styles.css";
import { useState } from "react";
import axios from "axios";

function App() {

  const [candidateCount, setCandidateCount] = useState(0);

  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: ""
  });

  const [job, setJob] = useState({
    requiredSkills: "",
    minExperience: ""
  });

  const [matches, setMatches] = useState([]);

  const [aiResult, setAiResult] = useState("");

  const handleCandidateChange = (e) => {
    setCandidate({
      ...candidate,
      [e.target.name]: e.target.value
    });
  };

  const handleJobChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const addCandidate = async () => {

    const payload = {
      ...candidate,
      skills: candidate.skills.split(","),
      experience: Number(candidate.experience)
    };

    await axios.post(
      "http://localhost:5000/api/candidates",
      payload
    );

    setCandidateCount(candidateCount + 1);

    alert("Candidate Added");
  };

  const matchCandidates = async () => {

    const response = await axios.post(
      "http://localhost:5000/api/match",
      {
        requiredSkills: job.requiredSkills.split(","),
        minExperience: Number(job.minExperience)
      }
    );

    setMatches(response.data);
  };

  const aiShortlist = async () => {

    const response = await axios.post(
      "http://localhost:5000/api/ai/shortlist",
      {
        requiredSkills: job.requiredSkills.split(","),
        minExperience: Number(job.minExperience)
      }
    );

    setAiResult(response.data.aiResponse);
  };

  return (
    <div className="container">

      <h1 className="title">
        AI Candidate Shortlisting System
      </h1>

      <h3>
        Total Candidates Added: {candidateCount}
      </h3>

      <div className="card">

        <h2>Add Candidate</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleCandidateChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleCandidateChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          onChange={handleCandidateChange}
        />

        <input
          type="number"
          name="experience"
          placeholder="Experience"
          onChange={handleCandidateChange}
        />

        <textarea
          name="bio"
          placeholder="Bio"
          onChange={handleCandidateChange}
        />

        <button onClick={addCandidate}>
          Add Candidate
        </button>

      </div>

      <div className="card">

        <h2>Job Requirements</h2>

        <input
          type="text"
          name="requiredSkills"
          placeholder="Required Skills"
          onChange={handleJobChange}
        />

        <input
          type="number"
          name="minExperience"
          placeholder="Minimum Experience"
          onChange={handleJobChange}
        />

        <button onClick={matchCandidates}>
          Match Candidates
        </button>

        <button onClick={aiShortlist}>
          AI Shortlist
        </button>

      </div>

      <div className="card">

        <h2>Matched Candidates</h2>

        {
          matches.map((candidate, index) => (

            <div className="candidate-card" key={index}>

              <h3>{candidate.name}</h3>

              <p>
                <strong>Match Score:</strong>
                {" "}
                {candidate.matchScore}%
              </p>

              <p>
                <strong>Ranking:</strong>
                {" "}
                <span className={candidate.ranking.toLowerCase()}>
                  {candidate.ranking}
                </span>
              </p>

              <p>
                <strong>Matched Skills:</strong>
                {" "}
                {candidate.matchedSkills.join(", ")}
              </p>

            </div>
          ))
        }

      </div>

      <div className="card">

        <h2>AI Recommendation</h2>

        <div className="ai-box">
          {aiResult}
        </div>

      </div>

    </div>
  );
}

export default App;