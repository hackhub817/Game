import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginFom";
import RockPaperScissorsGame from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import Rule from "./components/Rule";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />{" "}
        <Route path="/login" element={<LoginForm />} />{" "}
        <Route path="/game" element={<RockPaperScissorsGame />} />{" "}
        <Route path="/leaderboard" element={<Leaderboard />} />{" "}
        <Route path="/rules" element={<Rule />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
