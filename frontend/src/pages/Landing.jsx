import { useNavigate } from 'react-router-dom';
import './Landing.css';
import heroImg from '../assets/hero.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Background ambient glow blobs */}
      <div className="glow-blob blob-1"></div>
      <div className="glow-blob blob-2"></div>
      <div className="glow-blob blob-3"></div>

      {/* Grid background pattern */}
      <div className="grid-overlay"></div>

      {/* Landing Header/Navbar */}
      <header className="landing-nav">
        <div className="nav-container">
          <div className="brand">
            <span className="brand-dot"></span> TrackYourDay
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </nav>
          <div className="nav-actions">
            <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn-signup primary-btn" onClick={() => navigate('/login')}>Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">⚡ Meet your new productivity hub</span>
            <h1>Track your daily habits, <br /><span className="text-gradient">own your day.</span></h1>
            <p>
              Plan tasks, set deadlines, and get automated email notifications. Build a consistent routine and elevate your productivity with a high-end interface.
            </p>
            <div className="hero-cta">
              <button className="primary-btn btn-large" onClick={() => navigate('/login')}>
                Start Tracking Free
              </button>
              <a href="#features" className="secondary-link">Explore features →</a>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-glow"></div>
            <img src={heroImg} alt="TrackYourDay Dashboard Mockup" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2>Everything you need to excel</h2>
          <p>Carefully crafted features designed to keep you on schedule and tracking forward.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">📅</div>
            <h3>Task Scheduler</h3>
            <p>Organize daily chores, study schedules, or work tasks with high-precision dates and notes.</p>
          </div>
          
          <div className="feature-card glass-card">
            <div className="feature-icon">⏰</div>
            <h3>Smart Notifications</h3>
            <p>Receive elegant email reminders automatically when deadlines approach. Never miss a target.</p>
          </div>
          
          <div className="feature-card glass-card">
            <div className="feature-icon">📈</div>
            <h3>Insight Statistics</h3>
            <p>Track your task completion progress rates with clean, visual status meters and gauges.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <h2>Ready to transform your productivity?</h2>
          <p>Join thousands of professionals who rely on TrackYourDay to complete tasks daily.</p>
          <button className="primary-btn btn-large" onClick={() => navigate('/login')}>
            Get Started Now — It's Free
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} TrackYourDay. Built for high performance.</p>
        </div>
      </footer>
    </div>
  );
}
