import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Confetti from "react-confetti";
import LoginForm from "./LoginFom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const choices = ["Rock", "Paper", "Scissors"];

const RockPaperScissorsGame = () => {
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const token = Cookies.get("token");
  const name = Cookies.get("name");
  const history = useNavigate();
  useEffect(() => {
    // Check if token exists, if not, redirect to login
    if (!token) {
      history("/login"); // Redirect to login if token is missing
    } else {
      fetchHighScore();
      fetchLeaderboard();
    }
  }, [name, token, history]);

  const playGame = (choice) => {
    if (roundsPlayed < 10) {
      const computerChoice =
        choices[Math.floor(Math.random() * choices.length)];
      setPlayerChoice(choice);
      setComputerChoice(computerChoice);
      determineWinner(choice, computerChoice);
      setRoundsPlayed(roundsPlayed + 1);
    }
    if (roundsPlayed + 1 === 10) {
      setGameOver(true);
    }
  };

  const determineWinner = (player, computer) => {
    if (player === computer) {
      setResult("It's a tie!");
    } else if (
      (player === "rock" && computer === "scissors") ||
      (player === "scissors" && computer === "paper") ||
      (player === "paper" && computer === "rock")
    ) {
      setResult("You win!");
      setScore((prevScore) => {
        const newScore = prevScore + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
          setShowConfetti(true);
          saveHighScore(newScore);
        }
        saveScore(newScore);
        return newScore;
      });
    } else {
      setResult("You lose!");
    }
  };
  const fetchHighScore = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/highscore", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHighScore(response.data.highScore);
    } catch (error) {
      setError("Error fetching high score");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leaderboard");
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      setError("Error fetching leaderboard");
    }
  };

  const saveHighScore = async (score) => {
    try {
      await axios.post(
        "http://localhost:5000/api/highscore",
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError("Error saving high score");
    }
  };

  const saveScore = async (score) => {
    try {
      await axios.post(
        "http://localhost:5000/api/scores",
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError("Error saving score");
    }
  };

  const resetGame = () => {
    setPlayerChoice("");
    setComputerChoice("");
    setResult("");
    setScore(0);
    setRoundsPlayed(0);
    setGameOver(false);
    setShowConfetti(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("name");
    history("/login");
    resetGame();
    setError(""); // Clear error on logout
  };
  console.log("token", !token);
  return (
    <>
      {!token ? (
        <LoginForm />
      ) : (
        <>
          <div className="flex gap-8 flex-end justify-end p-6">
            <Link to="/leaderboard">
              <div className="text-lg text-white font-semibold hover:text-gray-300 hover:shadow-xl">
                Leaderboard
              </div>
            </Link>
            <Link to="/rules">
              <div className="text-lg text-white font-semibold hover:text-gray-300 hover:shadow-xl">
                Rules
              </div>
            </Link>

            <div
              className="text-lg text-white font-semibold hover:text-gray-300 hover:shadow-xl "
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
          <section className="relative flex flex-col items-center justify-between py-4">
            <div className="min-h-screen  flex flex-col items-center justify-center text-white">
              <img
                src="assets/hero.svg"
                alt="Hero"
                className="absolute -z-20 w-full h-full object-cover "
              />
              <div className="min-h-screen  flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">
                  Rock, Paper, Scissors
                </h1>
                <div className="w-[600px] bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                  <h2 className=" text-3xl mb-2 font-semibold text-gray-300">
                    High Score: {highScore}
                  </h2>
                  <h3 className="text-xl mb-2">Current Score: {score}</h3>
                  <h3 className="text-xl mb-2">
                    Rounds Played: {roundsPlayed} / 10
                  </h3>
                  {/* <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
                  >
                    Logout
                  </button> */}
                  {!gameOver ? (
                    <div className="flex justify-between mb-4">
                      {choices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => playGame(choice)}
                          className="bg-gray-800  hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                        >
                          <div className="flex justify-center p-1">
                            <img
                              src={`assets/${choice}.png`}
                              alt="Hero"
                              className="flex w-32 h-16 grayscale"
                            />
                          </div>
                          {choice}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={resetGame}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                      Start New Game
                    </button>
                  )}
                  <div className="flex gap-24 py-8 justify-center">
                    <div>
                      {" "}
                      <img
                        src={`assets/${playerChoice}.png`}
                        alt="playerChoice"
                        className="flex w-64 h-32 grayscale"
                      />
                    </div>
                    <div>
                      {" "}
                      <img
                        src={`assets/${computerChoice}.png`}
                        alt="ComputerChoice"
                        className="flex w-64 h-32 grayscale"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl mb-2">Your choice: {playerChoice}</h3>
                  <h3 className="text-xl mb-2">
                    Computer's choice: {computerChoice}
                  </h3>
                  <h2 className="text-2xl mb-4">{result}</h2>
                  {/* <Leaderboard leaderboard={leaderboard} /> */}
                  <button
                    onClick={resetGame}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

const Leaderboard = ({ leaderboard }) => (
  <div className="mt-6">
    <h3 className="text-2xl mb-4">Leaderboard</h3>
    <ul className="list-disc list-inside">
      {leaderboard.map((player, index) => (
        <li key={index} className="text-lg">
          {player.username} - {player.highScore} points
        </li>
      ))}
    </ul>
  </div>
);

export default RockPaperScissorsGame;
