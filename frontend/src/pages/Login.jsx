import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, oauthLogin, oauthMock } from '../services/api';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import './Auth.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOAuth = async providerName => {
    setIsLoading(true);
    try {
      let provider;
      if (providerName === 'google') provider = googleProvider;

      if (!provider) throw new Error("Invalid provider");

      // 1. Firebase Popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Send real data to backend
      const payload = {
        name: user.displayName,
        email: user.email || `${user.uid}@${providerName}.firebase.mock`,
        photo: user.photoURL,
        provider: providerName
      };

      const token = await oauthLogin(payload);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      
      // Fallback: Firebase not configured, OR backend is unreachable (network error)
      const isFirebaseConfigError = err.code === 'auth/invalid-api-key' 
        || err.code === 'auth/internal-error' 
        || err.message?.includes('API key not valid') 
        || err.message?.includes('auth/configuration-not-found');

      const isNetworkError = err instanceof TypeError && err.message?.includes('fetch');

      if (isFirebaseConfigError || isNetworkError) {
        if (isNetworkError) {
          console.warn("Backend unreachable, falling back to mock OAuth...");
        } else {
          console.warn("Firebase not configured properly, falling back to mock OAuth...");
        }
        try {
          const token = await oauthMock(providerName);
          localStorage.setItem('token', token);
          navigate('/dashboard');
          return;
        } catch (mockErr) {
          alert(mockErr.message || 'Mock OAuth fallback failed.');
        }
      } else {
        alert(err.message || 'OAuth authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          setIsLoading(false);
          return;
        }
        const token = await register({ name, email, password });
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        const token = await login({ email, password });
        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background glowing effects */}
      <div className="auth-glow blob-1"></div>
      <div className="auth-glow blob-2"></div>
      <div className="auth-grid-overlay"></div>

      <div className="auth-card">
        {/* Logo and Greeting */}
        <div className="auth-header">
          <div className="auth-brand" onClick={() => navigate('/')}>
            <div className="brand-logo-wrap">
              <span className="brand-dot"></span>
            </div>
            TrackYourDay
          </div>
          <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isRegister ? 'Start tracking your productivity today' : 'Enter your credentials to access your dashboard'}</p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-wrapper">
              <label htmlFor="password">Password</label>
              {!isRegister && <a href="#forgot" className="forgot-link">Forgot password?</a>}
            </div>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
            {!isLoading && <FiArrowRight />}
          </button>
        </form>

        {/* Separator */}
        <div className="auth-separator">
          <span>or continue with</span>
        </div>

        {/* Social Logins */}
        <div className="social-grid">
          <button className="social-btn" onClick={() => handleOAuth('google')} disabled={isLoading} type="button">
            <FcGoogle className="social-icon" />
            Continue with Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="auth-footer-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="auth-link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Sign In' : 'Sign up for free'}
          </span>
        </p>
      </div>
    </div>
  );
}
