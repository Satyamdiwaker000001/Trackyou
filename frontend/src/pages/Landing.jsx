import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <section className="landing">
      <div className="hero glass">
        <h1>TrackYourDay</h1>
        <p>Own your daily habits. Set tasks, meet deadlines, get reminders.</p>
        <button className="primary" onClick={() => navigate('/login')}>Get Started</button>
      </div>
    </section>
  );
}
