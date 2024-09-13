import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/game/leaderboard"
      );
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      setError("Error fetching leaderboard");
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <>
      <div className="mt-6 px-4 md:px-8">
        <button
          onClick={() => navigate("/game")}
          className="mb-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
          Back to Game
        </button>
        <h3 className="text-2xl md:text-4xl text-center text-white font-bold mb-4">
          Leaderboard
        </h3>
        {error && <p className="text-red-500 text-xl text-center">{error}</p>}
        <ul className="text-white text-center p-4">
          {leaderboard.map((player, index) => (
            <li
              key={index}
              className="text-lg md:text-2xl lg:text-3xl mb-2 p-4 md:p-6 font-semibold rounded-lg shadow-lg bg-gray-700 border border-gray-600"
            >
              <div className="flex justify-between w-full px-2 md:px-8">
                <div>{player.username}</div>
                <div>{player.highScore} points</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
