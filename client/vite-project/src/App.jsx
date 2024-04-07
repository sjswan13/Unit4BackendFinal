import React, { useState } from 'react'
import Login from './login.jsx';
import Reviews from './reviews.jsx';
import './App.css'

const App = () => {
  const [token, setToken] = useState('');

  const handkleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };
  return (
    <div>
      <h1>Review Site</h1>
      {!token ? (
        <Login onLogin={handkleLogin} />
      ) : (
        <Reviews />
      )}
    </div>
  );
};



export default App
