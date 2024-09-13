import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });
      history("/login");
      setError("");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };
  const redirectToLogin = () => {
    history("/login"); // Redirect to the "/" route
  };

  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <div className="min-h-screen  flex flex-col items-center justify-center text-white">
        <img
          src="assets/hero.svg"
          alt="Hero"
          className="absolute  w-full h-full object-cover "
        />
        <div className="w-96 z-20">
          <h1 className="text-3xl p-4 text-center font-bold">
            Please SignUp <br />
            To Play This Game
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded shadow-md"
          >
            <div className="mb-4">
              <label className="block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Sign Up
            </button>
            {error && (
              <p className="text-red-500 text-xl font-semibold">{error}</p>
            )}
            <p className="mt-4">
              Already have an account?{" "}
              <button
                onClick={redirectToLogin}
                className="text-yellow-300 underline"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
