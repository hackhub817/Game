import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  // Function to fetch the leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leaderboard");
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      setError("Error fetching leaderboard");
    }
  };

  // useEffect to automatically call fetchLeaderboard when the component mounts
  useEffect(() => {
    fetchLeaderboard();
  }, []); // The empty dependency array means this effect runs only once, on component mount

  return (
    <>
      <div className="mt-6">
        <h3 className="text-4xl text-center text-white font-bold mb-4">
          Leaderboard
        </h3>
        {error && <p className="text-red-500 text-xl text-center">{error}</p>}
        <ul className="text-white text-center p-4">
          {leaderboard.map((player, index) => (
            <li
              key={index}
              className="text-3xl  mb-2 p-2 font-semibold rounded-lg shadow-lg text-gray-400 border border-gray-700 bg-gray-700"
            >
              <div className="flex justify-between w-full px-8">
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
