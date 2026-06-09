import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = await login({ email, password });
      if (token) {
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error during login');
    }
  };

  return (
    <div className="auth-card glass">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="primary">
          Sign In
        </button>
      </form>
    </div>
  );
}
