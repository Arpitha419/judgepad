import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Trash2,
  Plus,
} from "lucide-react";

function App() {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
  const timer = setTimeout(() => {
    setShowApp(true);
  }, 2500);

  return () => clearTimeout(timer);
}, []);

  const [participants, setParticipants] = useState([]);

  const [newName, setNewName] = useState("");

  const [error, setError] = useState("");
  // Add participant
  const addParticipant = () => {
    if (newName.trim() === "") {
      alert("Please enter participant name");
      return;
    }

    const newParticipant = {
      id: Date.now(),
      name: newName,
      scores: [],
      input: "",
    };

    setParticipants([...participants, newParticipant]);
    setNewName("");
  };

  // Delete participant
  const deleteParticipant = (id) => {
    setParticipants(
      participants.filter(
        (participant) => participant.id !== id
      )
    );
  };

  // Handle score input
  const handleInputChange = (id, value) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id
          ? { ...participant, input: value }
          : participant
      )
    );
  };

  // Submit score
  const submitScore = (id) => {
    setParticipants((prev) =>
      prev.map((participant) => {
        if (participant.id === id) {
          const score = Number(participant.input);

          if (
            participant.input !== "" &&
            score >= 0 &&
            score <= 10
          ) {
            return {
              ...participant,
              scores: [...participant.scores, score],
              input: "",
            };
          } else {
            setError("Please enter participant name");

              setTimeout(() => {
                setError("");
              }, 3000);
          }
        }

        return participant;
      })
    );
  };

  // Reset scores
  const resetScores = () => {
    setParticipants((prev) =>
      prev.map((participant) => ({
        ...participant,
        scores: [],
        input: "",
      }))
    );
  };

  // Average calculation
  const getAverage = (scores) => {
    if (scores.length === 0) return "0.00";

    const total = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    return (total / scores.length).toFixed(2);
  };

  // Rankings
  const rankedParticipants = [...participants].sort(
    (a, b) =>
      Number(getAverage(b.scores)) -
      Number(getAverage(a.scores))
  );

  // INTRO SCREEN
  if (!showApp) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">

      <Trophy
        size={90}
        className="text-yellow-400 mb-6 animate-bounce"
      />

      <h1 className="text-6xl font-bold tracking-wide">
        JudgePad
      </h1>

      <p className="text-gray-400 mt-3 text-lg">
        Live Judging Platform
      </p>

    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {error && (
  <div className="fixed top-6 right-6 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-pulse">
    {error}
  </div>
)}
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-12 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Trophy size={42} />

            <h1 className="text-5xl font-bold">
              JudgePad
            </h1>
          </div>

          <p className="mt-4 text-lg text-orange-100">
            Score participants out of 10 and
            watch live rankings update.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto p-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold">
            Participants
          </h2>

          <button
            onClick={resetScores}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-3 rounded-xl transition"
          >
            Reset Scores
          </button>
        </div>

        {/* ADD PARTICIPANT */}
        <div className="bg-[#1e293b] rounded-3xl border border-gray-700 shadow-lg p-5 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter participant name..."
              value={newName}
              onChange={(e) =>
                setNewName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addParticipant();
                }
              }}
              className="flex-1 bg-[#0f172a] border border-gray-600 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              onClick={addParticipant}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-xl flex items-center gap-2 transition font-semibold"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>

        {/* PARTICIPANTS */}
        <div className="space-y-6">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="bg-[#1e293b] border border-gray-700 rounded-3xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-3xl font-semibold">
                    {participant.name}
                  </h3>

                  <p className="text-gray-400 mt-1">
                    {participant.scores.length} scores
                    · avg{" "}
                    <span className="font-bold text-white">
                      {getAverage(
                        participant.scores
                      )}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteParticipant(
                      participant.id
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={22} />
                </button>
              </div>

              {/* SCORE INPUT */}
              <div className="flex gap-4">
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Score 0-10"
                  value={participant.input}
                  onChange={(e) =>
                    handleInputChange(
                      participant.id,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitScore(participant.id);
                    }
                  }}
                  className="flex-1 bg-[#0f172a] border border-gray-600 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                  onClick={() =>
                    submitScore(
                      participant.id
                    )
                  }
                  className="bg-orange-500 hover:bg-orange-600 px-6 rounded-xl transition font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LIVE RANKINGS */}
        <div className="mt-10">
          <h2 className="text-4xl font-bold mb-6">
            Live Rankings
          </h2>

          <div className="bg-[#1e293b] border border-gray-700 rounded-3xl shadow-lg p-5 space-y-4">
            {rankedParticipants.map(
              (participant, index) => {
                let rank = 1;

              if (index > 0) {
                const currentAvg = getAverage(
                  participant.scores
                );

                const previousAvg = getAverage(
                  rankedParticipants[index - 1].scores
                );

                if (currentAvg === previousAvg) {
                  rank =
                    rankedParticipants[index - 1].rank;
                } else {
                  rank =
                    rankedParticipants[index - 1].rank + 1;
                }
              }

              // Store rank
              participant.rank = rank;

                const isTie =
                  index > 0 &&
                  getAverage(
                    participant.scores
                  ) ===
                    getAverage(
                      rankedParticipants[
                        index - 1
                      ].scores
                    );

                

                let icon;

                if (rank === 1) {
                  icon = (
                    <Trophy
                      size={22}
                      className="text-yellow-400"
                    />
                  );
                } else if (rank === 2) {
                  icon = (
                    <Medal
                      size={22}
                      className="text-gray-300"
                    />
                  );
                } else {
                  icon = (
                    <Award
                      size={22}
                      className="text-orange-400"
                    />
                  );
                }

                return (
                  <div
                    key={participant.id}
                    className="bg-[#0f172a] border border-gray-700 rounded-2xl p-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {icon}

                      <span className="text-2xl font-medium">
                        {rank}{" "}
                        {participant.name}
                      </span>
                    </div>

                    <span className="text-2xl font-bold">
                      {getAverage(
                        participant.scores
                      )}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;