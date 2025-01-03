import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

export default function SignIn({ onSignIn, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); 
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || "Invalid credentials";
        setError(errorMessage);
      } else {
        const data = await response.json();
        const token = data.access;
        localStorage.setItem("token", token);
        const accessTokenExpiresIn = 30 * 60 * 1000; // Example: 30 minutes
        const tokenExpiry = new Date().getTime() + accessTokenExpiresIn;
        localStorage.setItem("token_expiry", tokenExpiry);
        onSignIn(token); // Pass the access token to the parent component
        setUser(data.user_id); // Pass the user object to the parent component
        navigate('/');
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An error occurred during sign-in.");
    }
  };

  return (
    <div className="sign-in">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
       <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>

      <Link to="/sign-up">Don't have an account? Sign Up</Link> 
    </div>
  );
}