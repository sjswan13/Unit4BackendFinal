import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if(response.ok) {
      const data = await response.json();
      onLogin(data.token);
    } else {
      alert('Failed to Login')
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder='Email'/>
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder='Password'/>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;