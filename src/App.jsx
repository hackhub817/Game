import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginFom";
import RockPaperScissorsGame from "./components/Game";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />{" "}
        <Route path="/login" element={<LoginForm />} />{" "}
        <Route path="/game" element={<RockPaperScissorsGame />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
