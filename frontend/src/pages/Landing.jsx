import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiActivity, FiStar, FiGithub, FiTwitter, FiCheck } from 'react-icons/fi';
import heroImg from '../assets/hero.png';

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-bg text-text-primary font-sans overflow-x-hidden flex flex-col selection:bg-accent/30">
      {/* Background ambient glow blobs */}
      <div className="absolute top-[-15%] left-[15%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)' }}></div>
      <div className="absolute top-[25%] right-[5%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[5%] left-[5%] w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)' }}></div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-40" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1.5px, transparent 1.5px)',
        backgroundSize: '60px 60px',
        maskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)'
      }}></div>

      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-[1240px] w-full mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5 font-heading text-[1.4rem] font-extrabold tracking-tight text-white cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow animate-pulse-once"></span>
            </div>
            TrackYourDay
          </div>
          <nav className="hidden md:flex gap-10">
            <a href="#features" className="text-[0.95rem] font-medium text-text-secondary hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-[0.95rem] font-medium text-text-secondary hover:text-white transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-6">
            <button className="text-[0.95rem] font-semibold text-text-secondary hover:text-white transition-colors" onClick={() => navigate('/login')}>Sign In</button>
            <button className="px-5 py-2.5 text-[0.95rem] font-semibold rounded-lg bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] text-white border border-white/10 shadow-premium hover:-translate-y-0.5 hover:shadow-hover transition-all active:translate-y-0" onClick={() => navigate('/login')}>Get Started</button>
          </div>
        </div>
      </header>

      <main className="flex-grow z-20">
        {/* Hero Section */}
        <section className="w-full pt-40 pb-20 px-6 relative">
          <div className="max-w-[1240px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-20">
            <div className="flex flex-col items-start gap-8 text-left">
              <span className="animate-slide-up stagger-item text-[0.85rem] font-semibold text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full tracking-tight" style={{'--stagger-delay': 0}}>
                ⚡ Meet your new productivity hub
              </span>
              <h1 className="animate-slide-up stagger-item font-heading text-[3.5rem] md:text-[4rem] font-extrabold leading-[1.15] tracking-tight text-white m-0" style={{'--stagger-delay': 1.5}}>
                Track your habits, <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500">own your day.</span>
              </h1>
              <p className="animate-slide-up stagger-item text-xl leading-relaxed text-text-secondary m-0 max-w-[550px]" style={{'--stagger-delay': 3}}>
                Plan tasks, set deadlines, and get automated reminders. Build a consistent routine and elevate your productivity with a high-end interface.
              </p>
              <div className="animate-slide-up stagger-item flex items-center gap-6 mt-2" style={{'--stagger-delay': 4.5}}>
                <button className="px-8 py-4 text-lg font-semibold rounded-xl bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] text-white border border-white/10 shadow-premium hover:-translate-y-0.5 hover:shadow-hover transition-all active:translate-y-0" onClick={() => navigate('/login')}>
                  Start Tracking Free
                </button>
                <a href="#features" className="text-lg font-semibold text-indigo-300 hover:text-indigo-200 transition-colors flex items-center hover:translate-x-1 duration-200">
                  Explore features &rarr;
                </a>
              </div>
            </div>
            
            <div className="animate-slide-up stagger-item relative flex justify-center items-center w-full" style={{'--stagger-delay': 3}}>
              <div className="absolute w-[90%] h-[90%] bg-indigo-500/20 blur-[60px] rounded-full z-0"></div>
              
              {/* Device Frame */}
              <div className="relative z-10 rounded-[20px] border border-white/10 bg-surface-elevated shadow-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-500 w-full">
                <div className="flex items-center px-4 py-3 bg-surface border-b border-white/5 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <img src={heroImg} alt="Dashboard Mockup" className="w-full h-auto object-cover border-b border-white/5" />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none"></div>
        </section>

        {/* Social Proof Strip */}
        <section className="w-full py-10 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Built for developers & teams</p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {['JD', 'AK', 'MS', 'RJ', 'PL'].map((initials, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-[0.65rem] font-bold text-text-secondary shadow-sm">
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-warning">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-bold text-text-primary">4.9/5</span>
                <span className="text-sm text-text-muted">(1,200+ users)</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-24 px-6 relative">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-3">
              <span className="text-[0.85rem] font-bold uppercase tracking-widest text-indigo-400">Workflow</span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">How it works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-border border-dashed border-t border-white/10 z-0"></div>
              
              {[
                { step: '01', title: 'Create & Prioritize', desc: 'Add tasks quickly, assign priorities, and link them to dedicated projects.', icon: <FiCheckCircle className="w-6 h-6 text-primary" /> },
                { step: '02', title: 'Get Reminders', desc: 'Receive automated email notifications before important deadlines hit.', icon: <FiClock className="w-6 h-6 text-primary" /> },
                { step: '03', title: 'Build Momentum', desc: 'Track your daily streaks and visualize progress with deep analytics.', icon: <FiActivity className="w-6 h-6 text-primary" /> }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center p-6 bg-surface/50 backdrop-blur-sm border border-white/5 rounded-2xl">
                  <span className="absolute -top-4 -left-2 text-7xl font-extrabold text-white/[0.03] select-none pointer-events-none">{item.step}</span>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="w-full py-24 px-6 relative">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-3">
              <span className="text-[0.85rem] font-bold uppercase tracking-widest text-indigo-400">Features</span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">Everything you need to excel</h2>
              <p className="text-lg text-text-secondary max-w-[600px] mt-2">Carefully crafted features designed to keep you on schedule and moving forward.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(280px,auto)] gap-6">
              {/* Card 1: Task Scheduler (Large) */}
              <div className="col-span-1 md:col-span-2 row-span-2 bg-surface-glass hover:bg-surface-glass-hover backdrop-blur-md border border-white/5 hover:border-indigo-500/30 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] p-8 md:p-10 flex flex-col justify-between group overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                    <FiCheckCircle className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">Task Scheduler</h3>
                  <p className="text-text-secondary leading-relaxed max-w-md">Organize daily chores, study schedules, or work tasks with high-precision dates, priority tags, and project grouping.</p>
                </div>
                <div className="w-full mt-10 z-10 bg-black/20 rounded-2xl border border-white/5 p-6 flex flex-col gap-3">
                  <div className="h-14 w-full bg-surface border-l-4 border-l-danger rounded-xl flex items-center px-4 justify-between shadow-sm">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full border-2 border-border"></div><span className="text-sm font-medium text-text-primary">Finalize Q3 Presentation</span></div>
                    <span className="text-xs font-bold bg-danger/10 text-danger px-2.5 py-1 rounded-md uppercase tracking-wide">Urgent</span>
                  </div>
                  <div className="h-14 w-full bg-surface border-l-4 border-l-warning rounded-xl flex items-center px-4 justify-between shadow-sm">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full border-2 border-border"></div><span className="text-sm font-medium text-text-primary">Update Documentation</span></div>
                    <span className="text-xs font-bold bg-warning/10 text-warning px-2.5 py-1 rounded-md uppercase tracking-wide">High</span>
                  </div>
                  <div className="h-14 w-full bg-success/5 border-l-4 border-l-success rounded-xl flex items-center px-4 opacity-50 justify-between">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-success flex items-center justify-center"><FiCheck className="w-3 h-3 text-white" /></div><span className="text-sm font-medium text-text-primary line-through">Morning Standup</span></div>
                  </div>
                </div>
              </div>

              {/* Card 2: Smart Notifications */}
              <div className="bg-surface-glass hover:bg-surface-glass-hover backdrop-blur-md border border-white/5 hover:border-indigo-500/30 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] p-8 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                  <FiClock className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Smart Notifications</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Receive elegant email reminders automatically when deadlines approach. Never miss a target.</p>
              </div>

              {/* Card 3: Insight Statistics */}
              <div className="bg-surface-glass hover:bg-surface-glass-hover backdrop-blur-md border border-white/5 hover:border-indigo-500/30 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] p-8 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <FiActivity className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Insight Statistics</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Track your task completion progress rates with clean, visual status meters and charts.</p>
              </div>

              {/* Card 4: Project Grouping */}
              <div className="col-span-1 md:col-span-1 bg-surface-glass hover:bg-surface-glass-hover backdrop-blur-md border border-white/5 hover:border-indigo-500/30 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] p-8 flex flex-col justify-center">
                <h3 className="font-heading text-xl font-bold text-white mb-2">Project Grouping</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Keep your tasks organized into distinct projects for perfect clarity.</p>
              </div>

              {/* Card 5: Streak Tracking */}
              <div className="bg-surface-glass hover:bg-surface-glass-hover backdrop-blur-md border border-white/5 hover:border-indigo-500/30 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                     <span className="text-orange-400 text-sm">🔥</span>
                   </div>
                   <h3 className="font-heading text-xl font-bold text-white m-0">Streak System</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">Build unbreakable momentum. Track consecutive days of completed tasks.</p>
              </div>

              {/* Card 6: Command Palette */}
              <div className="bg-surface-glass hover:bg-surface-glass-hover backdrop-blur-md border border-white/5 hover:border-indigo-500/30 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[24px] p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                   <div className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center">Ctrl K</div>
                   <h3 className="font-heading text-xl font-bold text-white m-0">Quick Actions</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">Navigate instantly with a global command palette. The fastest way to move.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-24 px-6 border-t border-white/5 bg-surface-elevated/30">
          <div className="max-w-[1240px] mx-auto">
             <div className="text-center mb-16">
               <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">Loved by professionals</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { quote: "TrackYourDay entirely changed how I manage my side projects. The streak system keeps me coming back every day.", name: "Alex K.", role: "Software Engineer" },
                  { quote: "The interface is gorgeous. It feels like a premium enterprise tool, but it's simple enough for my daily personal chores.", name: "Sarah J.", role: "Product Designer" },
                  { quote: "Email reminders are a lifesaver. I no longer miss important deadlines because the app pings me right on time.", name: "Michael T.", role: "Freelancer" }
                ].map((t, i) => (
                  <div key={i} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
                    <p className="text-text-primary leading-relaxed text-[0.95rem] italic flex-grow">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {t.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{t.name}</p>
                        <p className="text-xs font-medium text-text-muted">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 px-6 relative z-10">
          <div className="max-w-[1240px] mx-auto bg-[linear-gradient(135deg,rgba(99,102,241,0.06)_0%,rgba(139,92,246,0.06)_100%)] border border-indigo-500/20 rounded-[28px] p-12 md:p-20 text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none"></div>
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-white m-0 relative z-10">Ready to transform your productivity?</h2>
            <p className="text-lg text-text-secondary max-w-[580px] m-0 relative z-10">Join thousands of professionals who rely on TrackYourDay to complete tasks daily and hit their goals.</p>
            <button className="mt-4 px-10 py-4 text-lg font-semibold rounded-xl bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] text-white border border-white/10 shadow-premium hover:-translate-y-1 hover:shadow-hover transition-all relative z-10" onClick={() => navigate('/login')}>
              Get Started Now — It's Free
            </button>
          </div>
        </section>
      </main>

      {/* 4-Column Footer */}
      <footer className="w-full border-t border-white/5 bg-[#02050e] pt-16 pb-8 px-6 mt-auto">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Col 1 */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-tight text-white mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow"></span>
                TrackYourDay
              </div>
              <p className="text-sm text-text-muted leading-relaxed">Built for high performance. Plan, track, and execute your goals with precision.</p>
            </div>
            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            {/* Col 4 */}
            <div>
              <h4 className="font-bold text-white mb-4">Connect</h4>
              <div className="flex items-center gap-4 text-text-secondary">
                <a href="#" className="hover:text-white transition-colors p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10"><FiTwitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10"><FiGithub className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-text-muted">
            <p>© {new Date().getFullYear()} TrackYourDay. All rights reserved.</p>
            <p>Made with passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
