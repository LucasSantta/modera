import React, { useState } from 'react';
import { auth } from '../services/firebase-config';

import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);


  const getUserInfo = () => {
    const user = auth.currentUser;
    if (user) {
      console.log("ID do Moderador:", user.uid);
      console.log("Email do Moderador:", user.email);
    } else {
      console.log("Nenhum usuário autenticado.");
    }
  };
  
  getUserInfo();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const moderadorId = userCredential.user.uid; // Obtém o ID único do moderador do Firebase Auth
      onLogin(moderadorId); 
    } catch (err) {
      setError('Falha no login: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Login do Moderador</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Login;
