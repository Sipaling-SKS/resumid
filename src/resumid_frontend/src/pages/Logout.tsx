import React from "react";
import { useAuth } from "../hooks/AuthContext";

const Logout: React.FC = () => {
  const { login, isAuthenticated, identity, principal } = useAuth();

  return (
    <div className="container">
      <h1>Internet Identity Client</h1>
      <h2>You are not authenticated</h2>
      <p>To log in, click this button!</p>
      <p>Principal: {JSON.stringify(principal)}</p>
      <p>Identity: {JSON.stringify(identity)}</p>
      <p>is Auth? {String(isAuthenticated)}</p>
      <button type="button" id="loginButton" onClick={login}>
        Log in
      </button>
    </div>
  );
};

export default Logout;