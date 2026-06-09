import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { fetchTasks, createTask, updateTask, deleteTask, getProfile, fetchProjects, createProject, deleteProject } from '../services/api';
import { FiGrid, FiList, FiTrendingUp, FiSettings, FiBell, FiSearch, FiLogOut, FiPlus, FiX, FiFolder, FiTrash2 } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import './Dashboard.css';



export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  
  // Project form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Load profile and tasks on mount
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const profile = await getProfile();
        setUser(profile);
        const [userTasks, userProjects] = await Promise.all([
          fetchTasks(),
          fetchProjects()
        ]);
        setTasks(userTasks);
        setProjects(userProjects);
      } catch (err) {
        console.error("Dashboard mount error:", err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateTask = async e => {
    e.preventDefault();
    if (!taskTitle || !taskDeadline) {
      alert("Title and Deadline are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const newTask = await createTask({
        title: taskTitle,
        description: taskDesc,
        deadline: taskDeadline
      });
      setTasks([newTask, ...tasks]);
      setTaskTitle('');
      setTaskDesc('');
      setTaskDeadline('');
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const updated = await updateTask(taskId, { completed: !currentStatus });
      setTasks(tasks.map(t => (t._id === taskId ? updated : t)));
    } catch (err) {
      alert(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async taskId => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      alert(err.message || "Failed to delete task");
    }
  };

  const handleCreateProject = async e => {
    e.preventDefault();
    if (!projectTitle) {
      alert("Project title is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const newProject = await createProject({
        title: projectTitle,
        description: projectDesc
      });
      setProjects([newProject, ...projects]);
      setProjectTitle('');
      setProjectDesc('');
      setIsProjectModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async projectId => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (err) {
      alert(err.message || "Failed to delete project");
    }
  };

  // Helper functions for user formatting
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

  const getLoginProvider = userData => {
    if (!userData) return 'Local Account';
    if (userData.provider === 'google') return 'Google OAuth';
    if (userData.provider === 'github') return 'GitHub OAuth';
    return 'Email Account';
  };

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const successRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const ringRadius = 24;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference - (successRate / 100) * ringCircumference;

  // Calculate dynamic chart data for the last 7 days
  const getDynamicChartData = () => {
    const data = [];
    const today = new Date();
    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const targetDate = subDays(today, i);
      const dayName = format(targetDate, 'EEE');
      
      // Count completed tasks for this specific date
      const completedCount = tasks.filter(t => t.completed && isSameDay(new Date(t.updatedAt || t.createdAt), targetDate)).length;
      
      data.push({
        name: dayName,
        completed: completedCount
      });
    }
    return data;
  };

  const dynamicChartData = getDynamicChartData();

  // Views
  const renderOverview = () => (
    <>
      <section className="panel-greeting">
        <h1>Welcome back, <span className="text-gradient">{user ? formatName(user).split(' ')[0] : 'Achiever'}!</span></h1>
        <p>Here are your task completion progress metrics and productivity tracking.</p>
      </section>

      <section className="metrics-grid">
        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Tasks Completed</span>
            <span className="metric-trend text-success">+{successRate}%</span>
          </div>
          <div className="metric-body-row">
            <span className="metric-value">{completedTasks}<span className="metric-total">/{totalTasks}</span></span>
            <div className="circular-progress-wrapper">
              <svg className="circular-svg" width="60" height="60" viewBox="0 0 60 60">
                <circle className="circle-bg" cx="30" cy="30" r="24" />
                <circle className="circle-fill" cx="30" cy="30" r="24" strokeDasharray={ringCircumference} strokeDashoffset={ringDashoffset} />
              </svg>
              <span className="progress-percent">{successRate}%</span>
            </div>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Active Tasks</span>
            <span className="metric-badge-tag status-pending">In Progress</span>
          </div>
          <div className="metric-body">
            <span className="metric-value">{pendingTasks}</span>
            <span className="metric-subtext">Tasks waiting for deadline</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Success Rate</span>
            <span className="metric-trend text-accent">Stable</span>
          </div>
          <div className="metric-body">
            <span className="metric-value text-accent">{successRate}%</span>
            <span className="metric-subtext">Completion percentage rate</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Focus Time</span>
            <span className="metric-badge-tag status-success">Active</span>
          </div>
          <div className="metric-body">
            <span className="metric-value text-success">{(completedTasks * 1.5).toFixed(1)}h</span>
            <span className="metric-subtext">Productive hours logged</span>
          </div>
        </div>
      </section>

      <section className="chart-widget-section glass">
        <div className="chart-header">
          <div>
            <h3>Daily Productivity Analytics</h3>
            <p>Tracking completed tasks count over the weekly calendar</p>
          </div>
          <div className="chart-legends">
            <span className="legend-item"><span className="legend-dot dot-primary"></span> Completed Tasks</span>
          </div>
        </div>
        <div className="chart-body" style={{ width: '100%', minHeight: 250 }}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dynamicChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );

  const renderTasks = () => (
    <section className="panel-tasks-section">
      <div className="tasks-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>My Daily Routines</h2>
          <span className="tasks-count-badge">{pendingTasks} Pending</span>
        </div>
        <button className="primary-btn" style={{ padding: '0.6rem 1rem', borderRadius: '10px' }} onClick={() => setIsModalOpen(true)}>
          <FiPlus /> New Task
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="empty-state glass">
          <p>No tasks found. Click "New Task" in the sidebar to create your first goal!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}
    </section>
  );

  const renderProjects = () => (
    <section className="panel-tasks-section">
      <div className="tasks-header">
        <h2>Active Projects</h2>
        <button className="primary-btn" style={{ padding: '0.6rem 1rem', borderRadius: '10px' }} onClick={() => setIsProjectModalOpen(true)}>
          <FiPlus /> New Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="empty-state glass">
          <FiFolder style={{ fontSize: '3rem', marginBottom: '1rem', color: '#64748b' }} />
          <p>No active projects yet. Group your tasks into projects to track broader milestones.</p>
        </div>
      ) : (
        <div className="metrics-grid">
          {projects.map(project => (
            <div key={project._id} className="metric-card glass" style={{ minHeight: 'auto' }}>
              <div className="metric-header" style={{ marginBottom: '1rem' }}>
                <span className="metric-title" style={{ color: '#ffffff', fontSize: '1.1rem', textTransform: 'none' }}>{project.title}</span>
                <span className="metric-badge-tag status-success">{project.status}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {project.description || "No description provided."}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleDeleteProject(project._id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderAnalytics = () => (
    <section className="panel-tasks-section">
      <div className="tasks-header">
        <h2>Deep Analytics</h2>
      </div>
      <div className="chart-widget-section glass" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Weekly Velocity</h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={dynamicChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompletedBig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="completed" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletedBig)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="panel-tasks-section">
      <div className="tasks-header">
        <h2>Account Settings</h2>
      </div>
      <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Profile Card */}
        <div className="metric-card glass" style={{ padding: '2rem', gap: '1.5rem', minHeight: 'auto' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Profile Details</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="user-avatar-circle" style={{ width: '80px', height: '80px', fontSize: '2rem', ...(user && user.photo ? { background: 'none' } : {}) }}>
              {user && user.photo ? (
                <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
              ) : (
                getInitials(user)
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 0.5rem 0' }}>{user ? formatName(user) : 'Loading...'}</h3>
              <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>{user?.email}</p>
              <span className="metric-badge-tag status-success">{user ? getLoginProvider(user) : 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="metric-card glass" style={{ padding: '2rem', gap: '1.5rem', minHeight: 'auto' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Preferences</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
            <div>
              <p style={{ color: '#e2e8f0', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Email Notifications</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Receive daily summaries of your tasks</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#6366f1', transition: '.4s', borderRadius: '34px' }}></span>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#e2e8f0', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Dark Mode</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Toggle application theme</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#6366f1', transition: '.4s', borderRadius: '34px' }}></span>
            </label>
          </div>
        </div>

        {/* Security & Danger Zone */}
        <div className="metric-card glass" style={{ padding: '2rem', gap: '1.5rem', minHeight: 'auto' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Security</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {user && user.provider === 'local' && (
              <button className="primary-btn" onClick={() => alert("Change Password UI coming soon")} style={{ padding: '0.6rem 1rem', borderRadius: '8px' }}>
                Change Password
              </button>
            )}
            <button className="btn-cancel" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <FiLogOut /> Sign Out
            </button>
            <button className="btn-cancel" onClick={() => alert("Are you sure? This cannot be undone.")} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </section>
  );

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <span className="brand-dot"></span>
          </div>
          <h2>TrackYourDay</h2>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-group">
            <span className="menu-group-title">Main Menu</span>
            <button className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <FiGrid className="menu-icon" /> Overview
            </button>
            <button className={`menu-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
              <FiList className="menu-icon" /> Tasks
            </button>
            <button className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <FiFolder className="menu-icon" /> Projects
            </button>
            <button className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <FiTrendingUp className="menu-icon" /> Analytics
            </button>
          </div>

          <div className="menu-group">
            <span className="menu-group-title">Preferences</span>
            <button className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <FiSettings className="menu-icon" /> Settings
            </button>
          </div>
        </nav>

        {/* Sidebar Footer Action */}
        <div className="sidebar-action">
          <button className="primary-btn sidebar-btn-add" onClick={() => setIsModalOpen(true)}>
            <FiPlus className="btn-icon-svg" /> New Task
          </button>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <div className="dashboard-panel">
        <div className="dashboard-bg-glow"></div>
        {/* Top Navbar Header */}
        <header className="panel-header">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-parent">Dashboard</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current" style={{ textTransform: 'capitalize' }}>{activeTab}</span>
          </div>

          <div className="header-actions">
            {/* User Profile Info */}
            <div className="user-profile-menu">
              <div className="user-avatar-circle" style={user && user.photo ? { background: 'none' } : {}}>
                {user && user.photo ? (
                  <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                ) : (
                  getInitials(user)
                )}
              </div>
              <div className="user-meta">
                <span className="user-name">{user ? formatName(user) : 'Loading...'}</span>
                <span className="user-provider-tag">{user ? getLoginProvider(user) : ''}</span>
              </div>
              <button className="btn-panel-logout" onClick={handleLogout} title="Logout">
                <FiLogOut />
              </button>
            </div>
          </div>
        </header>

        {/* Panel Main Area */}
        <main className="panel-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card glass-modal">
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label htmlFor="taskTitle">Task Title</label>
                <input
                  id="taskTitle"
                  type="text"
                  placeholder="e.g. Code auth dashboard module"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  placeholder="Briefly describe the task objectives..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDeadline">Deadline</label>
                <input
                  id="taskDeadline"
                  type="datetime-local"
                  value={taskDeadline}
                  onChange={e => setTaskDeadline(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Project Creation Modal */}
      {isProjectModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card glass-modal">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="btn-close-modal" onClick={() => setIsProjectModalOpen(false)}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label htmlFor="projectTitle">Project Title</label>
                <input
                  id="projectTitle"
                  type="text"
                  placeholder="e.g. Website Redesign"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectDesc">Description (Optional)</label>
                <textarea
                  id="projectDesc"
                  placeholder="Briefly describe the project scope..."
                  value={projectDesc}
                  onChange={e => setProjectDesc(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsProjectModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
