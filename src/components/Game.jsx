import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
  const [hover, setHover] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token");
  const name = Cookies.get("name");
  const history = useNavigate();
  useEffect(() => {
    if (!token) {
      history("/login");
    } else {
      fetchHighScore();
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
      setHover(true);
    }
    if (roundsPlayed + 1 === 10) {
      setGameOver(true);
    }
  };

  const determineWinner = (player1, computer1) => {
    const player = player1.toLowerCase(); // Convert player choice to lowercase
    const computer = computer1.toLowerCase();
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

  // const fetchLeaderboard = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/api/leaderboard");
  //     setLeaderboard(response.data.leaderboard);
  //   } catch (error) {
  //     setError("Error fetching leaderboard");
  //   }
  // };

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
    setHover(false);
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
              className="text-lg text-white font-semibold hover:text-gray-300 hover:shadow-xl cursor-pointer "
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
          <section className="relative flex flex-col items-center justify-between ">
            <div className="min-h-screen  flex flex-col items-center justify-center text-white">
              <img
                src="assets/hero.svg"
                alt="Hero"
                className="absolute -z-20 w-full h-full object-cover "
              />
              <div className="min-h-screen  flex flex-col items-center justify-center text-white">
                <h1 className="text-3xl font-bold mb-1">
                  Rock, Paper, Scissors
                </h1>
                <div className=" bg-gray-900 px-6 py-3 rounded-lg shadow-lg text-center">
                  <div>
                    <div>
                      <h2 className=" text-xl p-2 mb-2 font-semibold rounded-lg shadow-lg text-red-500 border border-indigo-600">
                        High Score: {highScore}
                      </h2>
                    </div>
                    <div>
                      <h3 className="text-xl  mb-2 p-2 font-semibold rounded-lg shadow-lg text-gray-300 border border-indigo-600">
                        Current Score: {score}
                      </h3>
                    </div>
                    <div>
                      <h3 className="text-xl  mb-2 p-2 font-semibold rounded-lg shadow-lg text-gray-300 border border-indigo-600">
                        Rounds Played: {roundsPlayed} / 10
                      </h3>
                    </div>
                  </div>

                  {!gameOver ? (
                    <div className="flex justify-center gap-16 mb-4 ">
                      <div className="flex items-center text-xl font-semibold text-white">
                        Select to Play ->
                      </div>
                      {choices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => playGame(choice)}
                          className="bg-gray-800  hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                        >
                          {/* <div className="flex justify-center p-1">
                            <img
                              src={`assets/${choice}.png`}
                              alt="Hero"
                              className="flex w-32 h-16 grayscale"
                            />
                          </div> */}
                          {choice}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={resetGame}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                      Start New Game
                    </button>
                  )}
                  <div
                    className={`${
                      hover ? "flex gap-24  py-2 justify-center" : "hidden"
                    }`}
                  >
                    <div>
                      {" "}
                      <img
                        src={`assets/${playerChoice}.png`}
                        alt="playerChoice"
                        className="flex w-32 h-16 grayscale"
                      />
                    </div>
                    <div>
                      {" "}
                      <img
                        src={`assets/${computerChoice}.png`}
                        alt="ComputerChoice"
                        className="flex w-32 h-16 grayscale"
                      />
                    </div>
                  </div>
                  <div className="flex gap-32 p-2 justify-center font-semibold rounded-lg shadow-lg  border border-indigo-600">
                    <h3 className="text-2xl mb-2 ">
                      Your choice
                      <br />
                      <span className="text-red-500 "> {playerChoice}</span>
                    </h3>
                    <div className="border-l border-indigo-600 ">
                      <h3 className="text-2xl ml-20 ">
                        Computer's choice
                        <br />
                        <span className="text-red-500"> {computerChoice}</span>
                      </h3>
                    </div>
                  </div>
                  <h2 className="text-3xl  font-bold text-red-500 py-2">
                    {result}
                  </h2>
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

export default RockPaperScissorsGame;
