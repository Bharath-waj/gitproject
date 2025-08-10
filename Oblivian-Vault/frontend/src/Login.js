import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
        <p className="register-text">
          New here? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
