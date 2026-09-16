import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: Spring Security's AuthenticationManager checks the 'username' 
      // field in the request body against our UserDetailsService. By mapping 
      // our 'identifier' state to 'username', it handles both usernames and emails seamlessly.
      const response = await axios.post("http://localhost:8080/login", {
        username: identifier,
        password,
      });

      // Save the JWT token and identifier/username
      localStorage.setItem("token", response.data);
      localStorage.setItem("username", identifier);

      toast.success("Logged in successfully!");
      // Example inside Login.jsx after a successful response:

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid username/email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "420px", height: "auto" }}
      >
        <h3 className="text-center mb-4 fw-bold">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold">Username or Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;