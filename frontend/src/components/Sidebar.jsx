import React from 'react';
import { FiGrid, FiList, FiFolder, FiTrendingUp, FiSettings, FiPlus, FiX, FiLogOut, FiCalendar } from 'react-icons/fi';

const formatName = userData => {
  if (userData?.name) return userData.name;
  if (!userData?.email) return 'Achiever';
  const part = userData.email.split('@')[0];
  return part.split(/[-._]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getInitials = userData => {
  if (!userData) return 'U';
  const name = formatName(userData);
  const parts = name.split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Sidebar = ({ activeTab, setActiveTab, setIsModalOpen, isSidebarOpen, setIsSidebarOpen, user, handleLogout }) => {
  const navItems = [
    { id: 'overview', icon: FiGrid, label: 'Overview' },
    { id: 'tasks', icon: FiList, label: 'Tasks' },
    { id: 'projects', icon: FiFolder, label: 'Projects' },
    { id: 'analytics', icon: FiTrendingUp, label: 'Analytics' },
    { id: 'calendar', icon: FiCalendar, label: 'Calendar' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-bg-base border-r border-border flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5 font-heading text-lg font-extrabold tracking-tight text-text-primary cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow"></span>
            TrackYourDay
          </div>
          <button className="lg:hidden text-text-muted hover:text-text-primary" onClick={() => setIsSidebarOpen(false)}>
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 mx-4 mt-6 mb-2 rounded-[14px] bg-surface-elevated border border-border shadow-sm flex items-center justify-between group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-[10px] bg-surface border border-white/5 flex items-center justify-center overflow-hidden">
              {user && user.photo ? (
                <img src={user.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-sm font-bold text-text-primary">{getInitials(user)}</span>
              )}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[0.9rem] font-bold text-text-primary truncate">{user ? formatName(user) : 'Loading...'}</span>
              <span className="text-xs font-medium text-text-muted truncate">Personal Workspace</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors opacity-0 group-hover:opacity-100" title="Logout">
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="mb-4 px-3 text-[0.7rem] font-bold tracking-widest text-text-muted uppercase">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-surface hover:text-text-primary hover:translate-x-1'}`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`} />
              <span className="text-[0.95rem]">{item.label}</span>
            </button>
          ))}
          
          <div className="my-4 border-t border-border mx-2"></div>
          
          <button
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'settings' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-surface hover:text-text-primary hover:translate-x-1'}`}
          >
            <FiSettings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`} />
            <span className="text-[0.95rem]">Settings</span>
          </button>
        </nav>

        {/* Action Footer */}
        <div className="p-5 border-t border-white/5 bg-bg-base shrink-0">
          <button 
            onClick={() => { setIsModalOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] text-white text-[0.95rem] font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-hover transition-all"
          >
            <FiPlus className="w-5 h-5" /> New Task
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
